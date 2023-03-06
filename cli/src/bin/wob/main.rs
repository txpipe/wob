use std::path::PathBuf;

use clap::{Parser, Subcommand};
use miette::{Context, IntoDiagnostic};
use tracing::Level;
use tracing_indicatif::IndicatifLayer;
use tracing_subscriber::prelude::*;

mod init;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(short, long)]
    config: Option<PathBuf>,
}

#[derive(Subcommand)]
enum Commands {
    Init(InitArgs),
    Up,
    Health,
    Logs,
    Down,
    Prune,
}

#[derive(Parser)]
struct InitArgs {
    #[arg(short, long)]
    static_files: Option<PathBuf>,
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

    match cli.command {
        Commands::Init(args) => {
            let inputs = init::gather_inputs()
                .into_diagnostic()
                .wrap_err("initializing wallet config failed")?;

            let config = onebox::config::build_config(&inputs)
                .into_diagnostic()
                .wrap_err("initializing wallet config failed")?;

            let ctx = onebox::Context::new(config, None, args.static_files)
                .into_diagnostic()
                .wrap_err("loading context failed")?;

            onebox::init(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("initializing wallet config failed")?;
        }
        Commands::Up => {
            let ctx = onebox::Context::load(cli.config, None, None).into_diagnostic()?;

            onebox::up(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet up failed")?;
        }
        Commands::Health => {
            let ctx = onebox::Context::load(cli.config, None, None).into_diagnostic()?;

            onebox::health(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("checking wallet health failed")?;
        }
        Commands::Logs => {
            let ctx = onebox::Context::load(cli.config, None, None).into_diagnostic()?;

            onebox::logs(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("checking wallet logs failed")?;
        }
        Commands::Down => {
            let ctx = onebox::Context::load(cli.config, None, None).into_diagnostic()?;

            onebox::down(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("turning wallet down failed")?;
        }
        Commands::Prune => {
            let ctx = onebox::Context::load(cli.config, None, None).into_diagnostic()?;

            onebox::prune(&ctx)
                .await
                .into_diagnostic()
                .wrap_err("pruning wallet resources failed")?;
        }
    }

    Ok(())
}
