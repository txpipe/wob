use std::str::FromStr;

use onebox::{
    config::{InitInputs, WellknownNetwork},
    providers::ALL_PROVIDER_IDS,
    Error,
};

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

    let inputs = InitInputs {
        name,
        network,
        enabled_providers: enabled_providers
            .into_iter()
            .map(|x| x.to_owned())
            .collect(),
    };

    Ok(inputs)
}
