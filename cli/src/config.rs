use std::path::PathBuf;

use config as framework;
use serde::{Deserialize, Serialize};
use strum_macros::EnumString;
use tracing::instrument;

use crate::{providers, Error};

pub struct InitInputs {
    pub name: String,
    pub network: crate::config::WellknownNetwork,
    pub enabled_providers: Vec<String>,
    pub blockfrost_api_key: Option<String>,
    pub token_registry_url: Option<String>,
}

#[instrument(skip_all)]
pub fn build_config(inputs: &InitInputs) -> Result<Config, Error> {
    let config = crate::config::Config {
        name: inputs.name.to_owned(),
        carp: providers::carp::Config::build(&inputs),
        node: providers::node::Config::build(&inputs),
        ogmios: providers::ogmios::Config::build(&inputs),
        proxy: providers::proxy::Config::build(&inputs),
        scrolls: providers::scrolls::Config::build(&inputs),
        ..Default::default()
    };

    let content = toml::to_string(&config).map_err(Error::other)?;
    std::fs::write(PathBuf::from("wob.toml"), content).map_err(Error::file_system)?;

    Ok(config)
}

#[derive(Clone, Deserialize, Serialize, EnumString)]
pub enum WellknownNetwork {
    #[strum(ascii_case_insensitive)]
    Mainnet,

    #[strum(ascii_case_insensitive)]
    PreProd,

    #[strum(ascii_case_insensitive)]
    Preview,
}

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct NetworkConfig {
    wellknown: Option<WellknownNetwork>,
}

#[derive(Clone, Deserialize, Serialize)]
pub struct Config {
    pub name: String,
    pub network: NetworkConfig,
    pub proxy: providers::proxy::Config,
    pub carp: providers::carp::Config,
    pub scrolls: providers::scrolls::Config,
    pub ogmios: providers::ogmios::Config,
    pub node: providers::node::Config,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            network: NetworkConfig {
                wellknown: Some(WellknownNetwork::Preview),
                ..Default::default()
            },
            name: "onebox".to_owned(),
            proxy: Default::default(),
            carp: Default::default(),
            scrolls: Default::default(),
            ogmios: Default::default(),
            node: Default::default(),
        }
    }
}

pub fn load(path: &PathBuf) -> Result<Config, Error> {
    let values = framework::Config::builder()
        .add_source(config::File::with_name(path.to_str().unwrap()))
        .add_source(framework::Environment::with_prefix("WOB"))
        .build()
        .map_err(Error::config)?;

    // Print out our settings (as a HashMap)
    values.try_deserialize::<Config>().map_err(Error::config)
}
