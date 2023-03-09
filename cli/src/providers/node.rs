use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tracing::{debug, instrument};

use crate::config::InitInputs;

use super::prelude::*;

pub const PROVIDER_ID: &str = "node";

const DEFAULT_IMAGE_AMD64: &str = "inputoutput/cardano-node:latest";
const DEFAULT_IMAGE_ARM64: &str = "ghcr.io/demeter-run/cardano-node-arm64:latest";

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
    if let Some(img) = &config.image {
        return img;
    }

    debug!("detected arch: {}", std::env::consts::ARCH);

    match std::env::consts::ARCH {
        "arm" | "aarch64" => DEFAULT_IMAGE_ARM64,
        _ => DEFAULT_IMAGE_AMD64,
    }
}

pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.ensure_host_dir(PathBuf::from(&"node"))?;

    let cardano_network = ctx.get_cardano_network();

    ctx.import_static_file(
        PathBuf::from(format!("{}/node/config.json", cardano_network)),
        PathBuf::from("node/config.json"),
    )?;

    ctx.import_static_file(
        PathBuf::from(format!("{}/node/topology.json", cardano_network)),
        PathBuf::from("node/topology.json"),
    )?;

    ctx.ensure_host_dir(PathBuf::from("genesis"))?;

    ctx.import_static_file(
        PathBuf::from(format!("{}/genesis/byron.json", cardano_network)),
        PathBuf::from("genesis/byron.json"),
    )?;

    ctx.import_static_file(
        PathBuf::from(format!("{}/genesis/shelley.json", cardano_network)),
        PathBuf::from("genesis/shelley.json"),
    )?;

    ctx.import_static_file(
        PathBuf::from(format!("{}/genesis/alonzo.json", cardano_network)),
        PathBuf::from("genesis/alonzo.json"),
    )?;

    ctx.ensure_host_dir(PathBuf::from("ipc"))?;

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
        network_mode: Some(ctx.define_network_name()),
        mounts: Some(ctx.define_mounts()),
        port_bindings: Some(port_bindings),
        memory: Some(8_000_000_000),
        restart_policy: Some(RestartPolicy {
            name: Some(RestartPolicyNameEnum::EMPTY),
            maximum_retry_count: Some(5),
        }),
        ..Default::default()
    };

    let image = define_image(config);

    let cardano_network = format!("NETWORK={}", ctx.get_cardano_network());

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
        env: Some(vec![&cardano_network]),
        host_config: Some(host_config),
        ..Default::default()
    };

    ctx.container_up("node", spec).await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn down(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_down("node").await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn health(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_health("node").await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn logs(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_logs("node").await?;

    Ok(())
}
