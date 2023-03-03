use bollard::Docker;

use super::utils::*;

#[tokio::test]
async fn up_down_works() {
    let ctx = test_context();

    crate::up(&ctx).await.unwrap();
    assert_container_running(&ctx, "node").await;
    assert_container_running(&ctx, "ogmios").await;

    crate::down(&ctx).await.unwrap();
    assert_container_doesnt_exist(&ctx, "node").await;
    assert_container_doesnt_exist(&ctx, "ogmios").await;
}

#[tokio::test]
async fn double_down_works() {
    let ctx = test_context();

    crate::down(&ctx).await.unwrap();
    assert_container_doesnt_exist(&ctx, "node").await;
    assert_container_doesnt_exist(&ctx, "ogmios").await;

    crate::down(&ctx).await.unwrap();
    assert_container_doesnt_exist(&ctx, "node").await;
    assert_container_doesnt_exist(&ctx, "ogmios").await;
}
