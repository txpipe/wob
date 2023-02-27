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
}

#[derive(Subcommand)]
enum Commands {
    Pull(CommonArgs),
    Prune(CommonArgs),
    Up(CommonArgs),
    Down(CommonArgs),
}

#[derive(Args)]
struct CommonArgs {
    #[arg(short, long)]
    config: Option<String>,
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

    match &cli.command {
        Commands::Pull(args) => {
            let cfg = onebox::config::load(args.config.as_deref()).into_diagnostic()?;

            onebox::pull(&cfg)
                .await
                .into_diagnostic()
                .wrap_err("pulling wallet resources failed")?;
        }
        Commands::Prune(args) => {
            let cfg = onebox::config::load(args.config.as_deref()).into_diagnostic()?;

            onebox::prune(&cfg)
                .await
                .into_diagnostic()
                .wrap_err("pruning wallet resources failed")?;
        }
        Commands::Up(args) => {
            let cfg = onebox::config::load(args.config.as_deref()).into_diagnostic()?;

            onebox::up(&cfg)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet up failed")?;
        }
        Commands::Down(args) => {
            let cfg = onebox::config::load(args.config.as_deref()).into_diagnostic()?;

            onebox::down(&cfg)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet down failed")?;
        }
    }

    Ok(())
}
