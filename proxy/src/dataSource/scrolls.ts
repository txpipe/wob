import * as redis from 'redis';
import { RedisClientType } from '@redis/client';
import { AdaHandle } from '../model/scrolls';
import { ProvideSingleton } from '../ioc';
import dotenv from 'dotenv';

dotenv.config();

export interface ScrollsDataSource {
    getAddressForHandle(handle: string): Promise<AdaHandle[]>;
    getLatestBlock(): Promise<unknown>;
}

@ProvideSingleton(ScrollsRedisDataSource)
export class ScrollsRedisDataSource implements ScrollsDataSource {
    private client: RedisClientType;

    constructor() {
        this.client = redis.createClient({
            url: process.env.SCROLLS_URL,
        });
    }

    /**
     * Returns an array of pairs <address, handle> for a given handle.
     *
     * Note: It includes all addresses matching a startWith expression
     * @param handle
     * @returns
     */
    async getAddressForHandle(handle: string): Promise<AdaHandle[]> {
        if (!this.client.isReady) {
            await this.client.connect();
        }

        const keys = (await this.client.sendCommand(['keys', `c.${handle}*`])) as string[];

        if (!keys) return [];

        const values = await this.client.mGet(keys);

        let index = 0;

        const result = keys.map(k => {
            const item: AdaHandle = {
                key: k.split('c.')[1],
                value: values[index] || '',
            };
            index += 1;
            return item;
        });

        return result;
    }

    //@TODO: Implement a scroll reducer - check if we need a different redis client
    getLatestBlock(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }
}
