use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tracing::{info, instrument};

use crate::config::InitInputs;

use super::prelude::*;

pub const PROVIDER_ID: &str = "ogmios";

const DEFAULT_IMAGE: &str = "cardanosolutions/ogmios:latest";

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

#[instrument(name = "ogmios", skip_all)]
pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.ensure_host_dir(PathBuf::from(&"ogmios"))?;

    ctx.import_static_file(
        PathBuf::from("preview/node/config.json"),
        PathBuf::from("ogmios/config.json"),
    )?;

    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn pull(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;

    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.remove_image(image_name).await?;

    ctx.container_down("ogmios").await?;

    ctx.remove_host_file(PathBuf::from("ogmios/config.json"))?;
    ctx.remove_host_dir(PathBuf::from(&"ogmios"))?;

    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    let port_bindings = ctx.build_port_bindings(vec![("1337", "tcp")]);

    let host_config = HostConfig {
        network_mode: Some(ctx.define_network_name()),
        mounts: Some(ctx.define_mounts()),
        memory: Some(2_000_000_000),
        port_bindings: Some(port_bindings),
        restart_policy: Some(RestartPolicy {
            name: Some(RestartPolicyNameEnum::UNLESS_STOPPED),
            maximum_retry_count: Some(0),
        }),
        ..Default::default()
    };

    let spec = ContainerSpec {
        image: Some(image_name),
        cmd: Some(vec![
            "--node-socket",
            "/host/ipc/node.socket",
            "--node-config",
            "/host/ogmios/config.json",
            "--host",
            "0.0.0.0",
        ]),
        hostname: Some("ogmios"),
        host_config: Some(host_config),
        ..Default::default()
    };

    ctx.container_up("ogmios", spec).await?;

    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn down(ctx: &Context, config: &Config) -> Result<(), Error> {
    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn health(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_health("ogmios").await?;

    Ok(())
}
