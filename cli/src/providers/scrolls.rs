use serde::{Deserialize, Serialize};
use std::{path::PathBuf, collections::HashMap};
use tracing::{debug, info, instrument};

use crate::config::InitInputs;

use super::prelude::*;

pub const PROVIDER_ID: &str = "scrolls";

const DEFAULT_IMAGE: &str = "ghcr.io/txpipe/scrolls:latest";

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

#[instrument(name = "scrolls", skip_all)]
pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.ensure_host_dir(PathBuf::from(&"scrolls"))?;

    ctx.import_static_file(
        PathBuf::from(format!("{}/scrolls/adahandle.toml", ctx.get_cardano_network())),
        PathBuf::from("scrolls/adahandle.toml"),
    )?;

    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;
    ctx.pull_image("bitnami/redis:latest").await?;

    Ok(())
}

#[instrument(name = "scrolls", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.remove_image(image_name).await?;
    ctx.remove_image("bitnami/redis:latest").await?;

    ctx.container_down("scrolls").await?;

    ctx.remove_host_file(PathBuf::from("scrolls/adahandle.toml"))?;
    ctx.remove_host_dir(PathBuf::from(&"scrolls"))?;

    Ok(())
}

#[instrument(name = "redis", skip_all)]
pub async fn up_redis(ctx: &Context, _config: &Config) -> Result<(), Error> {
    let redis_port_bindings = ctx.build_port_bindings(vec![("6379", "tcp")]);

    let redis_host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        network_mode: Some(ctx.define_network_name()),
        port_bindings: Some(redis_port_bindings),
        binds: Some(vec![String::from(format!("{}/redis:/bitnami/redis/data", ctx.working_dir.to_string_lossy()))]),
        ..Default::default()
    };

    let redis_spec = ContainerSpec {
        image: Some("bitnami/redis:latest"),
        hostname: Some("scrolls-redis"),
        env: Some(vec![
            "ALLOW_EMPTY_PASSWORD=yes",
        ]),
        host_config: Some(redis_host_config),
        ..Default::default()
    };

    ctx.container_up("scrolls-redis", redis_spec).await?;

    Ok(())
}

#[instrument(name = "daemon", skip_all)]
pub async fn up_daemon(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    let scrolls_host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        network_mode: Some(ctx.define_network_name()),
        memory: Some(1_500_000_000),
        ..Default::default()
    };

    let scrolls_spec = ContainerSpec {
        image: Some(image_name),
        cmd: Some(vec![
            "daemon",
            "--config",
            "/host/scrolls/adahandle.toml"
        ]),
        env: Some(vec![
            "RUST_LOG=debug",
        ]),
        hostname: Some("scrolls"),
        host_config: Some(scrolls_host_config),
        ..Default::default()
    };

    ctx.container_up("scrolls", scrolls_spec).await?;

    Ok(())
}

#[instrument(name = "scrolls", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    up_redis(ctx, config).await?;
    up_daemon(ctx, config).await?;
    Ok(())
}

#[instrument(name = "scrolls", skip_all)]
pub async fn down(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_down("scrolls").await?;
    ctx.container_down("scrolls-redis").await?;
    Ok(())
}

#[instrument(name = "scrolls", skip_all)]
pub async fn health(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_health("scrolls").await?;
    ctx.container_health("scrolls-redis").await?;
    Ok(())
}

#[instrument(name = "scrolls", skip_all)]
pub async fn logs(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_logs("scrolls").await?;
    ctx.container_logs("scrolls-redis").await?;
    Ok(())
}
