# Wallet OneBox (aka: `wob`)

Currently, if you want to deploy your own light wallet or similar application, there is no single tool that you can use. Instead, you can have to figure out how to deploy and combine multiple tools.

"Wallet OneBox" provides a single cohesive tool that one can use to setup downstream indexers and RPC services required to support common endpoints needed to run a wallet.

## Under the Hood

WOB relies on Docker to orchestrate the underlying components. We call each different component a `provider`. Providers define which images, configuration files and containers should be used to fullfil their part within the system.

In the current implementation, we rely on the following providers:

- `node`: the Cardano node, as data source for downstream providers.
- `carp`: for several endpoints related to transaction history, transaction outputs and price feeds.
- `blockfrost`: for endpoints related with reward history, pool metadata and tx submission.
- `ogmios`: for account state endpoints.
- `scrolls`: for ada handle reference endpoints.
- `proxy`: an API layer that exposes a REST wallet interface and routes each endpoint to the correct upstream provider.

WOB's main entry point is done through a CLI. This CLI provides the user with a way to initialize, start, stop, monitor and clean wallet resources.

## CLI usage

The CLI provides several commands to deal with the life-cycle of your wallet infrastructure. Those familiar with Docker Compose should find several similarities. You can think of the `wob` CLI as specialized version of Docker Compose to simplify this particular use-case.

### `init` command

The `init` command allows the user to provision the required resources to boot-up your wallet system. This will prompt the user with some questions regarding configuration and will then proceed to generate config files, pull required docker images and create a `wob.toml` file that contains the specs to execute further commands.

```sh
wob init
```

This command will generate several folders and files, it is recommended to run it in an empty directory to avoid collision with other files.

### `up` command

The `up` command will start the execution of the different components of your wallet system. Each component runs as different Docker container.

```sh
wob up
```

Beware that many of the different components will take some time to sync the required data from the chain. This may take from several minutes to several hours depending on the network selected during the init procedure.

### `health` command

The `health` command will output an indication of the health status for each component of the wallet system. For the wallet to be fully functional, each component should returning a "healthy" status.

```sh
wob health
```

### `logs` command

The `logs` command will hook into the stdout of each runtime component and stream the log messages through the console. Messages will be written interlaced, meaning that you will see them in chronological order regardless of the component that generated them. Each message is prefixed with a label indicating the source component.

```sh
wob logs
```

### `down` command

The `down` command will stop the execution of each component. This will release any allocated CPU / Mem resources. The persistent data will remain in your file system, meaning that you can restart your wallet system again and continue from where you left off.

```hs
wob down
```

### `prune` command

The `prune` command will remove any persistent data associated with your wallet and also remove the Docker images used for each component. The configuration files will remain. Beware that executing this command means that the init process needs to be ran again before being able to use the wallet.

```sh
wob prune
```

## Proxy usage

The `proxy` is the component in charge of routing the requests to the different providers which are implemented for full filling the requirements. It is implemented as an [Express application](https://expressjs.com/) in [NodeJs](https://nodejs.org/en/) following the Clean Architecture Principles.

All routes can be found under the `Controllers` folder and are automatically generated from `Typescript` decorators by using the functionality provided by [tsoa](https://tsoa-community.github.io/docs/introduction.html).

For running the `proxy` in development mode execute the following commands:

```sh
npm install
npm run build
npm run dev
```

The server will start listening in the `PORT` defined in the runtime environment variable named `PORT`. 

Together with the server, [OpenAPI Specification](https://swagger.io/specification/) will be served at the route `/docs`. 

