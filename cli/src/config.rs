use config as framework;
use serde::{Deserialize, Serialize};

use crate::Error;

#[derive(Clone, Deserialize, Serialize)]
pub enum WellknownNetwork {
    Mainnet,
    PreProd,
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
    pub proxy: Option<crate::providers::proxy::Config>,
    pub carp: Option<crate::providers::carp::Config>,
    pub blockfrost: Option<crate::providers::blockfrost::Config>,
    pub scrolls: Option<crate::providers::scrolls::Config>,
    pub ogmios: Option<crate::providers::ogmios::Config>,
    pub node: Option<crate::providers::node::Config>,
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
            blockfrost: Default::default(),
            scrolls: Default::default(),
            ogmios: Default::default(),
            node: Default::default(),
        }
    }
}

pub fn load(path: Option<&str>) -> Result<Config, Error> {
    let path = path.unwrap_or("./wob.toml");

    let values = framework::Config::builder()
        .add_source(config::File::with_name(path))
        .add_source(framework::Environment::with_prefix("WOB"))
        .build()
        .map_err(Error::config)?;

    // Print out our settings (as a HashMap)
    values.try_deserialize::<Config>().map_err(Error::config)
}
