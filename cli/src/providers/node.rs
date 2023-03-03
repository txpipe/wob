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

#[instrument(name = "node", skip_all)]
pub async fn pull(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.remove_image(image_name).await?;

    Ok(())
}

#[instrument(name = "node", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {

    let port_bindings = ctx.build_port_bindings(vec![("3000", "tcp"), ("3307", "tcp"), ("12798", "tcp")]);
    
    let host_config = HostConfig {
        mounts: Some(ctx.define_mounts()),
        port_bindings: Some(port_bindings),
        restart_policy: Some(RestartPolicy { name: Some(RestartPolicyNameEnum::UNLESS_STOPPED), maximum_retry_count: Some(0) }),
        ..Default::default()
    };

    let image = define_image(config);

    let spec = ContainerSpec {
        image: Some(image),
        entrypoint: Some(vec![
            "cardano-node",
            "run",
            "--config",
            "/host/configs/preview/config.json",
            "--topology",
            "/host/configs/preview/topology.json",
            "--database-path",
            "/host/node-db",
            "--socket-path",
            "/host/ipc/node.socket",
            "--port",
            "3000"
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
