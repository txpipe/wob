use miette::Diagnostic;
use thiserror::Error;

mod context;

pub use context::*;
use tracing::instrument;

#[derive(Debug, Error, Diagnostic)]
pub enum Error {
    #[error("error gathering user input")]
    Inquire(#[source] inquire::error::InquireError),

    #[error("error interacting with file system")]
    FileSystem(#[source] std::io::Error),

    #[error("error interacting with Docker daemon")]
    Docker(#[source] bollard::errors::Error),

    #[error("configuration error")]
    Config(#[source] config::ConfigError),

    #[error("{0}")]
    Other(String),
}

impl Error {
    pub fn inquire(err: inquire::error::InquireError) -> Self {
        Error::Inquire(err)
    }

    pub fn file_system(err: std::io::Error) -> Self {
        Error::FileSystem(err)
    }

    pub fn docker(err: bollard::errors::Error) -> Self {
        Error::Docker(err)
    }

    pub fn config(err: config::ConfigError) -> Self {
        Error::Config(err)
    }

    pub fn other(err: impl ToString) -> Self {
        Error::Other(err.to_string())
    }
}

macro_rules! for_every_enabled_provider {
    ($func:ident, $ctx:expr) => {{
        if $ctx.config.node.enabled {
            crate::providers::node::$func($ctx, &$ctx.config.node).await?;
        }

        if $ctx.config.ogmios.enabled {
            crate::providers::ogmios::$func($ctx, &$ctx.config.ogmios).await?;
        }

        if $ctx.config.carp.enabled {
            crate::providers::carp::$func($ctx, &$ctx.config.carp).await?;
        }

        if $ctx.config.proxy.enabled {
            crate::providers::proxy::$func($ctx, &$ctx.config.proxy).await?;
        }
    }};
}

#[instrument(skip_all)]
pub async fn init(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(init, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn prune(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(prune, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn up(ctx: &Context) -> Result<(), Error> {
    ctx.network_up().await?;

    for_every_enabled_provider!(up, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn down(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(down, &ctx);

    ctx.network_down().await?;

    Ok(())
}

#[instrument(skip_all)]
pub async fn health(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(health, &ctx);

    Ok(())
}
