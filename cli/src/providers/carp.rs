use serde::{Deserialize, Serialize};
use tracing::{info, instrument};

use super::prelude::*;

const DEFAULT_IMAGE: &str = "dcspark/carp:latest";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    pub enabled: bool,
    pub image: Option<String>,
}

fn define_image(config: &Config) -> &str {
    config.image.as_deref().unwrap_or(DEFAULT_IMAGE)
}

#[instrument(name = "carp", skip_all)]
pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn pull(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;
    ctx.pull_image("postgres:13.6").await?;
    ctx.pull_image("dcspark/carp-webserver:latest").await?;
    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.remove_image(image_name).await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    // postgres
    let postgres_port_bindings = ctx.build_port_bindings(vec![("5432", "tcp")]);

    let postgres_host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        network_mode: Some(String::from("wob")),
        port_bindings: Some(postgres_port_bindings),
        ..Default::default()
    };

    // @TODO: use secrets to store password and grab data from config
    let postgres_spec = ContainerSpec {
        image: Some("postgres:13.6"),
        // exposed_ports: Some(exposed_ports),
        env: Some(vec![
            "POSTGRES_LOGGING=true",
            "POSTGRES_USER=carp",
            "POSTGRES_DB=carp_preview",
            "POSTGRES_PASSWORD=1234",
        ]),
        host_config: Some(postgres_host_config),
        ..Default::default()
    };

    ctx.container_up("carp-postgres", postgres_spec).await?;

    let image_name = define_image(config);

    let carp_port_bindings = ctx.build_port_bindings(vec![("1337", "tcp")]);

    let carp_host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        network_mode: Some(String::from("wob")),
        memory_reservation: Some(536870912),
        port_bindings: Some(carp_port_bindings),
        ..Default::default()
    };

    let postgres_host = ctx.build_env_var("POSTGRES_HOST", &ctx.build_hostname("", "carp-postgres", ""));
    let database_url = ctx.build_env_var("DATABASE_URL", &ctx.build_hostname("postgresql://carp:1234@", "carp-postgres", ":5432/carp_preview"));

    let carp_spec = ContainerSpec {
        image: Some(image_name),
        env: Some(vec![
            "NETWORK=preview",
            &database_url,
            &postgres_host,
            "POSTGRES_PORT=5432",
            "POSTGRES_DB=carp_preview",
            "PGUSER=carp",
            "PGPASSWORD=1234",
            "RUST_BACKTRACE=1",
        ]),
        entrypoint: Some(vec![
            "/bin/bash",
            "-c",
            "/app/migration up ;
            /app/carp --config-path /host/carp/oura_docker.yml ;",
        ]),
        host_config: Some(carp_host_config),
        ..Default::default()
    };

    ctx.container_up("carp", carp_spec).await?;

    let carp_webserver_port_bindings = ctx.build_port_bindings(vec![("3000", "tcp")]);

    let carp_webserver_host_config = HostConfig {
        network_mode: Some(String::from("wob")),
        port_bindings: Some(carp_webserver_port_bindings),
        ..Default::default()
    };

    let mut exposed_ports = ::std::collections::HashMap::new();

    exposed_ports.insert("3000/tcp", ::std::collections::HashMap::new());

    let carp_webserver_spec = ContainerSpec {
        image: Some("dcspark/carp-webserver:latest"),
        env: Some(vec![
            &database_url,
        ]),
        host_config: Some(carp_webserver_host_config),
        exposed_ports: Some(exposed_ports),
        ..Default::default()
    };

    ctx.container_up("carp-webserver", carp_webserver_spec)
        .await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn down(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_down("carp").await?;
    ctx.container_down("carp-postgres").await?;
    ctx.container_down("carp-webserver").await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn health(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_health("carp").await?;
    ctx.container_health("carp-postgres").await?;
    ctx.container_health("carp-webserver").await?;

    Ok(())
}
