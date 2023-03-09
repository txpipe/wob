import { createInteractionContext, createStateQueryClient } from '@cardano-ogmios/client';
import { delegationsAndRewards } from '@cardano-ogmios/client/dist/StateQuery';
import { ProvideSingleton } from '../ioc';
import dotenv from 'dotenv';

dotenv.config();

export type DelegationAndRewardsByAccount = Awaited<ReturnType<typeof delegationsAndRewards>>;

export interface OgmiosDataSource {
    getDelegationsAndRewards(stakeKeyHashes: string[]): Promise<DelegationAndRewardsByAccount>;
}

@ProvideSingleton(OgmiosClientDataSource)
export class OgmiosClientDataSource implements OgmiosDataSource {
    private host: string;
    private port: number;
    private tls: boolean;
    private client: Awaited<ReturnType<typeof createStateQueryClient>> | undefined;

    constructor() {
        this.host = process.env.OGMIOS_HOST!;
        this.port = Number(process.env.OGMIOS_PORT!);
        this.tls = Boolean(process.env.OGMIOS_TLS);
    }

    async getDelegationsAndRewards(stakeKeyHashes: string[]): Promise<DelegationAndRewardsByAccount> {
        await this.initialize();
        if (!this.client) return {};

        return await this.client.delegationsAndRewards(stakeKeyHashes);
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
            { connection: { host: this.host, port: this.port, tls: this.tls } },
        );

        this.client = await createStateQueryClient(context);
    }
}
