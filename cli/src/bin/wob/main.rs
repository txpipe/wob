use std::str::FromStr;

use clap::{Args, Parser, Subcommand};
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
}

#[derive(Subcommand)]
enum Commands {
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
    let dir = std::env::current_dir().into_diagnostic()?;

    match &cli.command {
        Commands::Pull => {
            onebox::pull(&cfg, &dir)
                .await
                .into_diagnostic()
                .wrap_err("pulling wallet resources failed")?;
        }
        Commands::Up => {
            onebox::up(&cfg, &dir)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet up failed")?;
        }
        Commands::Health => {
            onebox::health(&cfg, &dir)
                .await
                .into_diagnostic()
                .wrap_err("checking wallet health failed")?;
        }
        Commands::Down => {
            onebox::down(&cfg, &dir)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet down failed")?;
        }
        Commands::Prune => {
            onebox::prune(&cfg, &dir)
                .await
                .into_diagnostic()
                .wrap_err("pruning wallet resources failed")?;
        }
    }

    Ok(())
}
