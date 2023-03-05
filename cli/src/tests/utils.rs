use crate::{config::Config, Context};
use bollard::Docker;

pub fn test_config() -> Config {
    Config {
        name: uuid::Uuid::new_v4().to_string(),
        node: crate::providers::node::Config {
            enabled: true,
            image: None,
        }
        .into(),
        ogmios: crate::providers::ogmios::Config {
            enabled: true,
            image: None,
        }
        .into(),
        ..Default::default()
    }
}

pub fn test_context() -> Context {
    let config = test_config();
    Context::new(config, None, None).unwrap()
}

pub async fn assert_image_exists(docker: &Docker, image_name: &str) {
    let exists = docker.inspect_image(image_name).await.is_ok();
    assert!(exists, "{image_name} expected to be available");
}

pub async fn assert_container_running(ctx: &Context, container_suffix: &str) {
    let container_name = format!("{}_{}", ctx.config.name, container_suffix);

    let exists = ctx
        .docker
        .inspect_container(&container_name, None)
        .await
        .is_ok();

    assert!(exists, "{container_name} expected to be available");
}

pub async fn assert_container_doesnt_exist(ctx: &Context, container_suffix: &str) {
    let container_name = format!("{}_{}", ctx.config.name, container_suffix);

    match ctx
        .docker_client()
        .inspect_container(&container_name, None)
        .await
    {
        Err(bollard::errors::Error::DockerResponseServerError {
            status_code: 404, ..
        }) => (),
        _ => assert!(false, "{container_name} shouldn't exist"),
    }
}
