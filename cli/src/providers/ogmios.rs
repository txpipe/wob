use serde::{Deserialize, Serialize};
use tracing::instrument;

use super::prelude::*;

const DEFAULT_IMAGE: &str = "cardanosolutions/ogmios:latest";

#[derive(Default, Clone, Deserialize, Serialize)]
pub struct Config {
    pub enabled: bool,
    pub image: Option<String>,
}

fn define_image(config: &Config) -> &str {
    config.image.as_deref().unwrap_or(DEFAULT_IMAGE)
}

#[instrument(name = "ogmios", skip_all)]
pub async fn pull(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.pull_image(image_name).await?;

    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn prune(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    ctx.remove_image(image_name).await?;

    Ok(())
}

#[instrument(name = "ogmios", skip_all)]
pub async fn up(ctx: &Context, config: &Config) -> Result<(), Error> {
    let image_name = define_image(config);

    let spec = ContainerSpec {
        image: Some(image_name),
        ..Default::default()
    };

    ctx.container_up("ogmios", spec).await?;

    Ok(())
}

pub async fn down(ctx: &Context, config: &Config) -> Result<(), Error> {
    ctx.container_down("ogmios").await?;

    Ok(())
}
