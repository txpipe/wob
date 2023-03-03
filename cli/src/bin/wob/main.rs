use std::path::PathBuf;

use clap::{Parser, Subcommand};
use miette::{Context, IntoDiagnostic};
use tracing::Level;
use tracing_indicatif::IndicatifLayer;
use tracing_subscriber::prelude::*;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(short, long)]
    config: Option<String>,

    #[arg(short, long)]
    static_files: Option<PathBuf>,
}

#[derive(Subcommand)]
enum Commands {
    Init,
    Pull,
    Up,
    Health,
    Down,
    Prune,
}

#[tokio::main]
async fn main() -> miette::Result<()> {
    let indicatif_layer = IndicatifLayer::new();

    tracing_subscriber::registry()
        //.with(tracing_subscriber::filter::LevelFilter::INFO)
        .with(tracing_subscriber::filter::Targets::default().with_target("onebox", Level::DEBUG))
        .with(tracing_subscriber::fmt::layer().with_writer(indicatif_layer.get_stderr_writer()))
        .with(indicatif_layer)
        .init();

    let cli = Cli::parse();
    let cfg = onebox::config::load(cli.config.as_deref()).into_diagnostic()?;
    let working_dir = std::env::current_dir().into_diagnostic()?;

    let static_files_root = cli
        .static_files
        .unwrap_or_else(|| PathBuf::from("/etc/wob/files"));

    let ctx = onebox::Context::new(cfg, working_dir, static_files_root)?;

    match &cli.command {
        Commands::Init => {
            onebox::init(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("initializing wallet config failed")?;
        }
        Commands::Pull => {
            onebox::pull(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("pulling wallet resources failed")?;
        }
        Commands::Up => {
            onebox::up(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet up failed")?;
        }
        Commands::Health => {
            onebox::health(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("checking wallet health failed")?;
        }
        Commands::Down => {
            onebox::down(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet down failed")?;
        }
        Commands::Prune => {
            onebox::prune(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("pruning wallet resources failed")?;
        }
    }

    Ok(())
}
