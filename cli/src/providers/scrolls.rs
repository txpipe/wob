use serde::{Deserialize, Serialize};

use crate::config::InitInputs;

pub const PROVIDER_ID: &str = "scrolls";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    enabled: bool,
}

impl Config {
    pub fn build(inputs: &InitInputs) -> Self {
        Self {
            enabled: inputs.enabled_providers.iter().any(|x| x == PROVIDER_ID),
            ..Default::default()
        }
    }
}
