use std::path::PathBuf;

use futures::future::join3;
use serde::{Deserialize, Serialize};
use tracing::instrument;

use crate::config::InitInputs;

use super::prelude::*;

pub const PROVIDER_ID: &str = "carp";

const DEFAULT_IMAGE: &str = "dcspark/carp:latest";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    pub enabled: bool,
    pub image: Option<String>,
}

impl Config {
    pub fn build(inputs: &InitInputs) -> Self {
        Self {
            enabled: inputs.enabled_providers.iter().any(|x| x == PROVIDER_ID),
            ..Default::default()
        }
    }
}

fn define_image(config: &Config) -> &str {
    config.image.as_deref().unwrap_or(DEFAULT_IMAGE)
}

#[instrument(name = "carp", skip_all)]
pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.ensure_host_dir(PathBuf::from("carp"))?;

    ctx.import_static_file(
        PathBuf::from("preview/carp/oura.yml"),
        PathBuf::from("carp/oura.yml"),
    )?;

    ctx.ensure_host_dir(PathBuf::from("carp/pgdata"))?;

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

    ctx.remove_host_file(PathBuf::from("carp/oura.yml"))?;
    ctx.remove_host_dir(PathBuf::from("carp"))?;

    Ok(())
}

#[instrument(name = "postgres", skip_all)]
pub async fn up_postgres(ctx: &Context, _config: &Config) -> Result<(), Error> {
    let postgres_port_bindings = ctx.build_port_bindings(vec![("5432", "tcp")]);

    let postgres_host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        network_mode: Some(ctx.define_network_name()),
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
            "POSTGRES_DB=carp",
            "POSTGRES_PASSWORD=1234",
            "PGDATA=/host/carp/pgdata",
        ]),
        hostname: Some("carp-postgres"),
        host_config: Some(postgres_host_config),
        ..Default::default()
    };

    ctx.container_up("carp-postgres", postgres_spec).await?;

    Ok(())
}

#[instrument(name = "indexer", skip_all)]
pub async fn up_indexer(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    let carp_port_bindings = ctx.build_port_bindings(vec![("1337", "tcp")]);

    let carp_host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        network_mode: Some(ctx.define_network_name()),
        memory: Some(1_500_000_000),
        port_bindings: Some(carp_port_bindings),
        ..Default::default()
    };

    let carp_spec = ContainerSpec {
        image: Some(image_name),
        env: Some(vec![
            "NETWORK=preview",
            "POSTGRES_HOST=carp-postgres",
            "DATABASE_URL=postgresql://carp:1234@carp-postgres:5432/carp",
            "POSTGRES_PORT=5432",
            "POSTGRES_DB=carp",
            "PGUSER=carp",
            "PGPASSWORD=1234",
            "RUST_BACKTRACE=1",
        ]),
        entrypoint: Some(vec![
            "/bin/bash",
            "-c",
            "sleep 20 ;
            /app/migration up ;
            /app/carp --config-path /host/carp/oura.yml ;",
        ]),
        hostname: Some("carp"),
        host_config: Some(carp_host_config),
        ..Default::default()
    };

    ctx.container_up("carp", carp_spec).await?;

    Ok(())
}

#[instrument(name = "webserver", skip_all)]
pub async fn up_webserver(ctx: &Context, _config: &Config) -> Result<(), Error> {
    let carp_webserver_port_bindings = ctx.build_port_bindings(vec![("3000", "tcp")]);

    let carp_webserver_host_config = HostConfig {
        network_mode: Some(ctx.define_network_name()),
        port_bindings: Some(carp_webserver_port_bindings),
        ..Default::default()
    };

    let mut exposed_ports = ::std::collections::HashMap::new();

    exposed_ports.insert("3000/tcp", ::std::collections::HashMap::new());

    let carp_webserver_spec = ContainerSpec {
        image: Some("dcspark/carp-webserver:latest"),
        env: Some(vec![
            "DATABASE_URL=postgresql://carp:1234@carp-postgres:5432/carp",
        ]),
        hostname: Some("carp-webserver"),
        host_config: Some(carp_webserver_host_config),
        exposed_ports: Some(exposed_ports),
        ..Default::default()
    };

    ctx.container_up("carp-webserver", carp_webserver_spec)
        .await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    up_postgres(ctx, config).await?;
    up_indexer(ctx, config).await?;
    up_webserver(ctx, config).await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn down(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_down("carp").await?;
    ctx.container_down("carp-postgres").await?;
    ctx.container_down("carp-webserver").await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn health(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_health("carp").await?;
    ctx.container_health("carp-postgres").await?;
    ctx.container_health("carp-webserver").await?;

    Ok(())
}

#[instrument(name = "carp", skip_all)]
pub async fn logs(ctx: &Context, _config: &Config) -> Result<(), Error> {
    let x = join3(
        ctx.container_logs("carp"),
        ctx.container_logs("carp-postgres"),
        ctx.container_logs("carp-webserver"),
    );

    let (a, b, c) = x.await;

    a?;
    b?;
    c?;

    Ok(())
}
