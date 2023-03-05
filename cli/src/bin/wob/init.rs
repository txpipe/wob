use std::str::FromStr;

use onebox::{
    config::{InitInputs, WellknownNetwork},
    providers::ALL_PROVIDER_IDS,
    Error,
};

pub fn gather_advanced_inputs(basic: InitInputs) -> Result<InitInputs, Error> {
    let default_providers: Vec<_> = ALL_PROVIDER_IDS
        .iter()
        .enumerate()
        .map(|(idx, _)| idx)
        .collect();

    let enabled_providers = inquire::MultiSelect::new("providers:", ALL_PROVIDER_IDS.to_vec())
        .with_default(&default_providers)
        .with_help_message("disable providers that you don't need")
        .prompt()
        .map_err(Error::inquire)?;

    let blockfrost_api_key = inquire::Text::new("blockfrost api key? (esc for default)")
        .prompt_skippable()
        .map_err(Error::inquire)?;

    let token_registry_url = inquire::Text::new("token registry url? (esc for default)")
        .prompt_skippable()
        .map_err(Error::inquire)?;

    let advanced = InitInputs {
        enabled_providers: enabled_providers.iter().map(|x| String::from(*x)).collect(),
        blockfrost_api_key,
        token_registry_url,
        ..basic
    };

    Ok(advanced)
}

pub fn gather_inputs() -> Result<InitInputs, Error> {
    let name = inquire::Text::new("name:")
        .with_help_message("the name of your wallet environment")
        .prompt()
        .map_err(Error::inquire)?;

    let network = inquire::Select::new("network:", vec!["mainnet", "preprod", "preview"])
        .with_help_message("the well-known Cardano network for you wallet environment")
        .prompt()
        .map_err(Error::inquire)?;

    let network = WellknownNetwork::from_str(network).map_err(Error::other)?;

    let advanced = inquire::Confirm::new("enter advance config?")
        .prompt()
        .map_err(Error::inquire)?;

    let basic = InitInputs {
        name,
        network,
        enabled_providers: ALL_PROVIDER_IDS.iter().map(|x| String::from(*x)).collect(),
        blockfrost_api_key: None,
        token_registry_url: None,
    };

    if advanced {
        gather_advanced_inputs(basic)
    } else {
        Ok(basic)
    }
}
