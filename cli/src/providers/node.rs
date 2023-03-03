use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tracing::{info, instrument};

use super::prelude::*;

const DEFAULT_IMAGE: &str = "inputoutput/cardano-node:latest";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    pub enabled: bool,
    pub image: Option<String>,
}

fn define_image(config: &Config) -> &str {
    config.image.as_deref().unwrap_or(DEFAULT_IMAGE)
}

pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.ensure_host_dir(PathBuf::from(&"node"))?;

    ctx.import_static_file(
        PathBuf::from("preview/node/config.json"),
        PathBuf::from("node/config.json"),
    )?;

    ctx.import_static_file(
        PathBuf::from("preview/node/topology.json"),
        PathBuf::from("node/topology.json"),
    )?;

    ctx.ensure_host_dir(PathBuf::from("genesis"))?;

    ctx.import_static_file(
        PathBuf::from("preview/genesis/byron.json"),
        PathBuf::from("genesis/byron.json"),
    )?;

    ctx.import_static_file(
        PathBuf::from("preview/genesis/shelley.json"),
        PathBuf::from("genesis/shelley.json"),
    )?;

    ctx.import_static_file(
        PathBuf::from("preview/genesis/alonzo.json"),
        PathBuf::from("genesis/alonzo.json"),
    )?;

    ctx.ensure_host_dir(PathBuf::from("ipc"))?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn pull(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    // remove images
    ctx.remove_image(image_name).await?;

    // remove genesis files
    ctx.remove_host_file(PathBuf::from("genesis/byron.json"))?;
    ctx.remove_host_file(PathBuf::from("genesis/shelley.json"))?;
    ctx.remove_host_file(PathBuf::from("genesis/alonzo.json"))?;
    ctx.ensure_host_dir(PathBuf::from("genesis"))?;

    // remove node config files
    ctx.remove_host_file(PathBuf::from("node/config.json"))?;
    ctx.remove_host_file(PathBuf::from("node/topology.json"))?;
    ctx.remove_host_dir(PathBuf::from("node"))?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    let port_bindings =
        ctx.build_port_bindings(vec![("3000", "tcp"), ("3307", "tcp"), ("12798", "tcp")]);

    let host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        port_bindings: Some(port_bindings),
        restart_policy: Some(RestartPolicy {
            name: Some(RestartPolicyNameEnum::EMPTY),
            maximum_retry_count: Some(5),
        }),
        ..Default::default()
    };

    let image = define_image(config);

    let spec = ContainerSpec {
        image: Some(image),
        entrypoint: Some(vec![
            "cardano-node",
            "run",
            "--config",
            "/host/node/config.json",
            "--topology",
            "/host/node/topology.json",
            "--database-path",
            "/host/node-db",
            "--socket-path",
            "/host/ipc/node.socket",
            "--port",
            "3000",
        ]),
        env: Some(vec!["NETWORK=preview"]),
        host_config: Some(host_config),
        ..Default::default()
    };

    ctx.container_up("node", spec).await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn down(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_down("node").await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn health(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_health("node").await?;

    Ok(())
}
