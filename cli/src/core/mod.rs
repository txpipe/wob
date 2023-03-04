use bollard::network::CreateNetworkOptions;
use miette::Diagnostic;
use thiserror::Error;

mod context;

pub use context::*;
use tracing::{instrument, info};

#[derive(Debug, Error, Diagnostic)]
pub enum Error {
    #[error("error interacting with file system")]
    FileSystem(#[source] std::io::Error),

    #[error("error interacting with Docker daemon")]
    Docker(#[source] bollard::errors::Error),

    #[error("configuration error")]
    Config(#[source] config::ConfigError),
}

impl Error {
    pub fn file_system(err: std::io::Error) -> Self {
        Error::FileSystem(err)
    }

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

        if let Some(i) = &$ctx.config.carp {
            if i.enabled {
                crate::providers::carp::$func($ctx, i).await?;
            }
        }

        if let Some(i) = &$ctx.config.proxy {
            if i.enabled {
                crate::providers::proxy::$func($ctx, i).await?;
            }
        }
    }};
}

#[instrument(skip_all)]
pub async fn init(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(init, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn pull(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(pull, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn prune(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(prune, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn up(ctx: &Context) -> Result<(), Error> {
    
    let create_network_options = CreateNetworkOptions {
        name: "wob",
        check_duplicate: true,
        driver: if cfg!(windows) {
            "transparent"
        } else {
            "bridge"
        },
        ..Default::default()
    };

    ctx.docker
        .create_network(create_network_options)
        .await
        .map_err(Error::docker)?;

    info!("wob network created");

    for_every_enabled_provider!(up, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn down(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(down, &ctx);

    Ok(())
}

#[instrument(skip_all)]
pub async fn health(ctx: &Context) -> Result<(), Error> {
    for_every_enabled_provider!(health, &ctx);

    Ok(())
}
