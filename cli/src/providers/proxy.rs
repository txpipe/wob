use serde::{Deserialize, Serialize};
use tracing::instrument;

use crate::config::{InitInputs, WellknownNetwork};

use super::prelude::*;

pub const PROVIDER_ID: &str = "proxy";

const DEFAULT_IMAGE: &str = "ghcr.io/txpipe/wob-proxy:latest";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    pub enabled: bool,
    pub image: Option<String>,
    pub blockfrost_api_key: Option<String>,
    pub blockfrost_network: Option<String>,
    pub token_registry_url: Option<String>,
}

fn wellknown_network_to_blockfrost(network: &WellknownNetwork) -> Option<String> {
    match network {
        WellknownNetwork::Mainnet => String::from("cardano-mainnet").into(),
        WellknownNetwork::PreProd => String::from("cardano-preprod").into(),
        WellknownNetwork::Preview => String::from("cardano-preview").into(),
        _ => None,
    }
}

impl Config {
    pub fn build(inputs: &InitInputs) -> Self {
        Self {
            enabled: inputs.enabled_providers.iter().any(|x| x == PROVIDER_ID),
            blockfrost_api_key: inputs.blockfrost_api_key.clone(),
            blockfrost_network: wellknown_network_to_blockfrost(&inputs.network),
            token_registry_url: inputs.token_registry_url.clone(),
            ..Default::default()
        }
    }
}

fn define_image(config: &Config) -> &str {
    config.image.as_deref().unwrap_or(DEFAULT_IMAGE)
}

#[instrument(name = "proxy", skip_all)]
pub async fn init(ctx: &Context, config: &Config) -> Result<(), Error> {
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
        network_mode: Some(ctx.define_network_name()),
        port_bindings: Some(port_bindings),
        restart_policy: Some(RestartPolicy {
            name: Some(RestartPolicyNameEnum::UNLESS_STOPPED),
            maximum_retry_count: Some(0),
        }),
        ..Default::default()
    };

    let image = define_image(config);

    let bf_api_key = format!(
        "BLOCKFROST_API_KEY={}",
        config.blockfrost_api_key.as_deref().unwrap_or_default()
    );

    let bf_network = format!(
        "BLOCKFROST_NETWORK={}",
        config.blockfrost_network.as_deref().unwrap_or_default()
    );

    let token_registry_url = format!(
        "TOKEN_REGISTRY_URL={}",
        config.token_registry_url.as_deref().unwrap_or_default()
    );

    let spec = ContainerSpec {
        image: Some(image),
        env: Some(vec![
            "SCROLLS_URL=redis://scrolls-redis:6379",
            "CARP_HOST=http://carp-webserver:3000",
            "OGMIOS_HOST=ogmios",
            "OGMIOS_PORT=1337",
            "OGMIOS_TLS=false",
            "PORT=8000",
            &bf_api_key,
            &bf_network,
            &token_registry_url,
        ]),
        host_config: Some(host_config),
        ..Default::default()
    };

    ctx.container_up("proxy", spec).await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn down(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_down("proxy").await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn health(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_health("proxy").await?;

    Ok(())
}

#[instrument(name = "proxy", skip_all)]
pub async fn logs(ctx: &Context, _config: &Config) -> Result<(), Error> {
    ctx.container_logs("proxy").await?;

    Ok(())
}
