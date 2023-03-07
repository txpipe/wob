import * as redis from 'redis';
import { RedisClientType } from '@redis/client';
import { AdaHandle } from '../model/scrolls';
import { ProvideSingleton } from '../ioc';
import dotenv from 'dotenv';

dotenv.config();

export interface ScrollsDataSource {
    getAddressForHandle(handle: string): Promise<AdaHandle[]>;
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

        const keys = (await this.client.sendCommand(['keys', `AdaHandle.${handle}*`])) as string[];

        if (!keys || !keys.length) return [];

        const values = await this.client.mGet(keys);

        let index = 0;

        const result = keys.map(k => {
            const item: AdaHandle = {
                key: k.split('AdaHandle.')[1],
                value: values[index] || '',
            };
            index += 1;
            return item;
        });

        return result;
    }
}
