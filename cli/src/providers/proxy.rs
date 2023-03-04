use serde::{Deserialize, Serialize};
use tracing::{info, instrument};

use super::prelude::*;

const DEFAULT_IMAGE: &str = "ghcr.io/txpipe/wob-proxy:latest";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    pub enabled: bool,
    pub image: Option<String>,
    pub blockfrost_api_key: Option<String>,
    pub blockfrost_network: Option<String>,
    pub token_registry_url: Option<String>,
}

fn define_image(config: &Config) -> &str {
    config.image.as_deref().unwrap_or(DEFAULT_IMAGE)
}

#[instrument(name = "proxy", skip_all)]
pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn pull(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.remove_image(image_name).await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    let port_bindings = ctx.build_port_bindings(vec![("8000", "tcp")]);

    let host_config = HostConfig {
        network_mode: Some(String::from("wob")),
        port_bindings: Some(port_bindings),
        restart_policy: Some(RestartPolicy {
            name: Some(RestartPolicyNameEnum::UNLESS_STOPPED),
            maximum_retry_count: Some(0),
        }),
        ..Default::default()
    };

    let image = define_image(config);
    
    let blockfrost_api_key = ctx.build_env_var("BLOCKFROST_API_KEY", config.blockfrost_api_key.as_deref().unwrap());
    let blockfrost_network= ctx.build_env_var("BLOCKFROST_NETWORK", config.blockfrost_network.as_deref().unwrap());
    let ogmios_host = ctx.build_env_var("OGMIOS_HOST", &ctx.build_hostname("", "ogmios", ""));
    let carp_host = ctx.build_env_var("CARP_HOST", &ctx.build_hostname("http://", "carp-webserver", ":3000"));
    let token_registry_url = ctx.build_env_var("TOKEN_REGISTRY_URL", config.token_registry_url.as_deref().unwrap());

    let spec = ContainerSpec {
        image: Some(image),
        env: Some(vec![
            "SCROLLS_URL=redis://kvrocks-mainnet-adahandle.ftr-scrolls-v0.svc.cluster.local:6666",
            &blockfrost_api_key,
            &blockfrost_network,
            &ogmios_host,
            &carp_host,
            &token_registry_url,
            "OGMIOS_PORT=1337",
            "PORT=8000",
        ]),
        host_config: Some(host_config),
        ..Default::default()
    };

    ctx.container_up("proxy", spec).await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn down(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_down("proxy").await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn health(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_health("proxy").await?;

    Ok(())
}
