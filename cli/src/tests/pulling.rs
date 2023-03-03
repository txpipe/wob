use bollard::Docker;

use super::utils::*;

#[tokio::test]
async fn pull_works() {
    let ctx = test_context();

    crate::pull(&ctx).await.unwrap();

    let docker = Docker::connect_with_socket_defaults().unwrap();
    assert_image_exists(&docker, "cardanosolutions/ogmios:latest").await;
    assert_image_exists(&docker, "inputoutput/cardano-node:latest").await;
}
