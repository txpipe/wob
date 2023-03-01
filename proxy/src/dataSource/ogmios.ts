import { createInteractionContext, createStateQueryClient } from '@cardano-ogmios/client';

export interface OgmiosDataSource {
    // @TODO: Define types
    getDelegationsAndRewards(stakeKeyHashes: string[]): Promise<{ [k: string]: any }>;
}

export class OgmiosClientDataSource implements OgmiosDataSource {
    private host: string;
    private client: Awaited<ReturnType<typeof createStateQueryClient>> | undefined;

    constructor(host: string) {
        this.host = host;
    }

    async getDelegationsAndRewards(stakeKeyHashes: string[]): Promise<{ [k: string]: any }> {
        await this.initialize();
        if (!this.client) return {};

        const result = await this.client.delegationsAndRewards(stakeKeyHashes);
        // @TODO: Map result
        return result;
    }

    /**
     * Connects the client and returns an initialized context if not connected
     */
    async initialize() {
        // Lazy initialization of ogmios client
        if (this.client) return this.client;

        // @TODO: Handle error state better
        const context = await createInteractionContext(
            err => console.error(err),
            () => console.log('Connection closed.'),
            { connection: { host: this.host, tls: false } },
        );

        this.client = await createStateQueryClient(context);
    }
}
