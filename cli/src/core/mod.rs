use crate::config::Config;
use futures::future::join_all;
use miette::Diagnostic;
use thiserror::Error;

mod context;

pub use context::*;
use tracing::instrument;

#[derive(Debug, Error, Diagnostic)]
pub enum Error {
    #[error("error interacting with Docker daemon")]
    Docker(#[source] bollard::errors::Error),

    #[error("configuration error")]
    Config(#[source] config::ConfigError),
}

impl Error {
    pub fn docker(err: bollard::errors::Error) -> Self {
        Error::Docker(err)
    }

    pub fn config(err: config::ConfigError) -> Self {
        Error::Config(err)
    }
}

macro_rules! for_every_enabled_provider {
    ($func:ident, $ctx:expr) => {{
        if let Some(i) = &$ctx.config.node {
            if i.enabled {
                crate::providers::node::$func($ctx, i).await?;
            }
        }

        if let Some(i) = &$ctx.config.ogmios {
            if i.enabled {
                crate::providers::ogmios::$func($ctx, i).await?;
            }
        }
    }};
}

#[instrument(skip_all)]
pub async fn pull(config: &Config) -> Result<(), Error> {
    let ctx = Context::try_from(config.clone())?;

    for_every_enabled_provider!(pull, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn prune(config: &Config) -> Result<(), Error> {
    let ctx = Context::try_from(config.clone())?;

    for_every_enabled_provider!(prune, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn up(config: &Config) -> Result<(), Error> {
    let ctx = Context::try_from(config.clone())?;

    for_every_enabled_provider!(up, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn down(config: &Config) -> Result<(), Error> {
    let ctx = Context::try_from(config.clone())?;

    for_every_enabled_provider!(down, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn health(config: &Config) -> Result<(), Error> {
    let ctx = Context::try_from(config.clone())?;

    for_every_enabled_provider!(health, &ctx);

    Ok(())
}
