use bollard::{
    container::CreateContainerOptions,
    image::CreateImageOptions,
    service::{ContainerState, HealthStatusEnum, ProgressDetail},
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
}

impl Context {
    pub async fn image_exists(&self, image_name: &str) -> Result<bool, Error> {
        Ok(self.docker.inspect_image(image_name).await.is_ok())
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
}

impl TryFrom<Config> for Context {
    type Error = Error;

    fn try_from(config: Config) -> Result<Self, Error> {
        let docker = Docker::connect_with_socket_defaults().map_err(Error::docker)?;
        Ok(Context { config, docker })
    }
}
