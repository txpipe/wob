use std::{
    collections::{hash_map::RandomState, HashMap},
    path::PathBuf,
};

use bollard::{
    container::CreateContainerOptions,
    image::CreateImageOptions,
    network::CreateNetworkOptions,
    service::{HealthStatusEnum, Mount, MountTypeEnum, PortBinding, ProgressDetail},
    Docker,
};
use futures::StreamExt;
use tracing::{debug, error, info, instrument, warn};

use super::Error;
use crate::config::Config;

pub type ContainerSpec<Z> = bollard::container::Config<Z>;

fn progress_detail_to_percent(x: ProgressDetail) -> f32 {
    match (x.current, x.total) {
        (Some(current), Some(total)) => current as f32 / total as f32,
        _ => 0.0,
    }
}

pub struct Context {
    pub config: Config,
    pub docker: Docker,
    pub working_dir: PathBuf,
    pub static_files_root: PathBuf,
}

impl Context {
    pub fn load(
        config_path: Option<PathBuf>,
        working_dir: Option<PathBuf>,
        static_files_root: Option<PathBuf>,
    ) -> Result<Self, Error> {
        let config_path = config_path.unwrap_or(PathBuf::from("./wob.toml"));

        let config = crate::config::load(&config_path)?;

        Context::new(config, working_dir, static_files_root)
    }

    pub fn new(
        config: Config,
        working_dir: Option<PathBuf>,
        static_files_root: Option<PathBuf>,
    ) -> Result<Self, Error> {
        let current_dir = std::env::current_dir().map_err(Error::file_system)?;
        let working_dir = working_dir.unwrap_or(current_dir);

        let static_files_root =
            static_files_root.unwrap_or_else(|| PathBuf::from("/etc/wob/files"));

        let docker = Docker::connect_with_socket_defaults().map_err(Error::docker)?;

        Ok(Self {
            config,
            docker,
            working_dir,
            static_files_root,
        })
    }

    pub(crate) fn docker_client(&self) -> &Docker {
        &self.docker
    }

    pub async fn image_exists(&self, image_name: &str) -> Result<bool, Error> {
        Ok(self.docker.inspect_image(image_name).await.is_ok())
    }

    pub fn define_network_name(&self) -> String {
        format!("wob_{}", self.config.name)
    }

    async fn network_exists(&self, name: &str) -> Result<bool, Error> {
        Ok(self
            .docker
            .inspect_network::<String>(name, None)
            .await
            .is_ok())
    }

    #[instrument(skip(self))]
    pub async fn network_up(&self) -> Result<(), Error> {
        let name = self.define_network_name();

        if self.network_exists(&name).await? {
            info!("network already created, skipping");
            return Ok(());
        }

        let create_network_options = CreateNetworkOptions {
            name,
            check_duplicate: true,
            driver: if cfg!(windows) {
                "transparent".to_string()
            } else {
                "bridge".to_string()
            },
            ..Default::default()
        };

        self.docker
            .create_network(create_network_options)
            .await
            .map_err(Error::docker)?;

        info!("network created");

        Ok(())
    }

    #[instrument(skip(self))]
    pub async fn network_down(&self) -> Result<(), Error> {
        let name = self.define_network_name();

        if !self.network_exists(&name).await? {
            info!("network already removed, skipping");
            return Ok(());
        }

        self.docker
            .remove_network(&name)
            .await
            .map_err(Error::docker)?;

        info!("network removed");

        Ok(())
    }

    #[instrument(skip(self))]
    pub async fn remove_image(&self, image_name: &str) -> Result<(), Error> {
        if !self.image_exists(image_name).await? {
            debug!("image doesn't exists");
            return Ok(());
        }

        self.docker
            .remove_image(image_name, None, None)
            .await
            .map_err(Error::docker)?;

        info!("image removed");

        Ok(())
    }

    #[instrument(skip(self))]
    pub async fn pull_image(&self, image_name: &str) -> Result<(), Error> {
        if self.image_exists(image_name).await? {
            debug!("image already exists");
            return Ok(());
        }

        let options = CreateImageOptions {
            from_image: image_name,
            platform: "linux/amd64",
            ..Default::default()
        };

        let mut progress = self.docker.create_image(Some(options), None, None);
        info!("image pull started");

        while let Some(res) = progress.next().await {
            match res {
                Ok(info) => {
                    info!(
                        "image pull progress {} {:?} {}",
                        info.status.as_deref().unwrap_or(&""),
                        info.id,
                        info.progress_detail
                            .map(|i| progress_detail_to_percent(i).to_string())
                            .unwrap_or("--".to_string())
                    );
                }
                Err(err) => {
                    error!("image pull error {:?}", err);
                    return Err(Error::docker(err));
                }
            }
        }

        info!("image pull completed");

        Ok(())
    }

    async fn container_exists(&self, name: &str) -> Result<bool, Error> {
        Ok(self.docker.inspect_container(name, None).await.is_ok())
    }

    async fn create_container(&self, name: &str, spec: ContainerSpec<&str>) -> Result<(), Error> {
        let opts = CreateContainerOptions {
            name,
            platform: None,
        };

        self.docker
            .create_container(Some(opts), spec)
            .await
            .map_err(Error::docker)?;

        info!("container created");

        Ok(())
    }

    fn define_container_name(&self, suffix: &str) -> String {
        format!("{}_{}", self.config.name, suffix)
    }

    pub fn build_port_bindings(
        &self,
        ports: Vec<(&str, &str)>,
    ) -> HashMap<String, Option<Vec<PortBinding>>, RandomState> {
        let mut port_bindings = ::std::collections::HashMap::new();

        for port in ports.into_iter() {
            let (port_number, port_type) = port;
            port_bindings.insert(
                String::from(format!("{}/{}", port_number, port_type)),
                Some(vec![PortBinding {
                    host_ip: Some(String::from("127.0.0.1")),
                    host_port: Some(String::from(port_number.to_owned())),
                }]),
            );
        }

        return port_bindings;
    }

    pub fn define_mounts(&self) -> Vec<Mount> {
        let mounts = vec![Mount {
            target: Some(String::from("/host")),
            source: Some(String::from(self.working_dir.to_string_lossy())),
            typ: Some(MountTypeEnum::BIND),
            consistency: Some(String::from("default")),
            ..Default::default()
        }];
        return mounts;
    }

    pub async fn container_up(&self, suffix: &str, spec: ContainerSpec<&str>) -> Result<(), Error> {
        let name = &self.define_container_name(suffix);

        if !self.container_exists(name).await? {
            self.create_container(name, spec).await?;
        }

        self.docker
            .start_container::<&str>(name, None)
            .await
            .map_err(Error::docker)?;

        info!("container started");

        Ok(())
    }

    pub async fn container_down(&self, suffix: &str) -> Result<(), Error> {
        let name = &self.define_container_name(suffix);

        if !self.container_exists(name).await? {
            info!("container doesn't exist, skipping");
            return Ok(());
        }

        self.docker
            .stop_container(name, None)
            .await
            .map_err(Error::docker)?;

        info!("container stopped");

        self.docker
            .remove_container(name, None)
            .await
            .map_err(Error::docker)?;

        info!("container removed");

        Ok(())
    }

    pub async fn container_health(&self, suffix: &str) -> Result<(), Error> {
        let name = self.define_container_name(suffix);

        let info = self
            .docker
            .inspect_container(&name, None)
            .await
            .map_err(Error::docker)?;

        if let Some(state) = info.state {
            info!("container status: {:?}", state.status);

            if let Some(health) = state.health {
                match health.status {
                    Some(HealthStatusEnum::HEALTHY) => info!("health check reporting healthy"),
                    Some(HealthStatusEnum::STARTING) => warn!("health check starting"),
                    Some(HealthStatusEnum::UNHEALTHY) => warn!("health check failing"),
                    _ => info!("no health checks available"),
                }
            }

            if state.dead.unwrap_or_default() {
                warn!("container is dead");
            }

            if state.oom_killed.unwrap_or(false) {
                warn!("container is out of memory");
            }

            if state.restarting.unwrap_or_default() {
                warn!("container is restarting");
            }
        }

        Ok(())
    }

    #[instrument(skip(self))]
    pub fn ensure_host_dir(&self, rel_path: PathBuf) -> Result<(), Error> {
        let mut target = self.working_dir.clone();
        target.push(rel_path);

        if target.is_dir() {
            debug!("dir already exists");
            return Ok(());
        }

        std::fs::create_dir(target).map_err(Error::file_system)?;
        info!("host dir created");

        Ok(())
    }

    #[instrument(skip(self))]
    pub fn import_static_file(
        &self,
        rel_source: PathBuf,
        rel_target: PathBuf,
    ) -> Result<(), Error> {
        let mut target = self.working_dir.clone();
        target.push(rel_target);

        if target.is_file() {
            debug!("file already exists");
            return Ok(());
        }

        let mut source = self.static_files_root.clone();
        source.push(rel_source);

        std::fs::copy(source, target).map_err(Error::file_system)?;
        info!("static file imported");

        Ok(())
    }

    #[instrument(skip(self))]
    pub fn remove_host_file(&self, rel_path: PathBuf) -> Result<(), Error> {
        let mut target = self.working_dir.clone();
        target.push(rel_path.clone());

        if !target.is_file() {
            debug!("file already removed");
            return Ok(());
        }

        std::fs::remove_file(target).map_err(Error::file_system)?;
        info!("host file removed");

        Ok(())
    }

    #[instrument(skip(self))]
    pub fn remove_host_dir(&self, rel_path: PathBuf) -> Result<(), Error> {
        let mut target = self.working_dir.clone();
        target.push(rel_path.clone());

        if !target.is_dir() {
            debug!("dir already removed");
            return Ok(());
        }

        std::fs::remove_dir(target).map_err(Error::file_system)?;
        info!("host dir removed");

        Ok(())
    }
}
