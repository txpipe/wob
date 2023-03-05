pub mod prelude;

pub mod carp;
pub mod node;
pub mod ogmios;
pub mod proxy;
pub mod scrolls;

pub const ALL_PROVIDER_IDS: &[&str] = &[
    carp::PROVIDER_ID,
    node::PROVIDER_ID,
    ogmios::PROVIDER_ID,
    proxy::PROVIDER_ID,
    scrolls::PROVIDER_ID,
];
