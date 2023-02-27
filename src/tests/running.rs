use bollard::Docker;

use super::utils::*;

#[tokio::test]
async fn up_down_works() {
    let config = test_config();

    let docker = Docker::connect_with_socket_defaults().unwrap();

    crate::up(&config).await.unwrap();
    assert_container_running(&docker, &config, "node").await;
    assert_container_running(&docker, &config, "ogmios").await;

    crate::down(&config).await.unwrap();
    assert_container_doesnt_exist(&docker, &config, "node").await;
    assert_container_doesnt_exist(&docker, &config, "ogmios").await;
}

#[tokio::test]
async fn double_down_works() {
    let config = test_config();

    let docker = Docker::connect_with_socket_defaults().unwrap();

    crate::down(&config).await.unwrap();
    assert_container_doesnt_exist(&docker, &config, "node").await;
    assert_container_doesnt_exist(&docker, &config, "ogmios").await;

    crate::down(&config).await.unwrap();
    assert_container_doesnt_exist(&docker, &config, "node").await;
    assert_container_doesnt_exist(&docker, &config, "ogmios").await;
}
