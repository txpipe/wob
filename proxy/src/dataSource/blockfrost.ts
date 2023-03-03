import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestError } from '../api/errors';
import { Pool, Reward } from '../model/blockfrost';

// Network specifics for blockfrost data source
export type Network = 'cardano-mainnet' | 'cardano-preprod' | 'cardano-preview';

/**
 * Returns the blockfrost base URL given the network we are connecting to
 * @TODO check if this is required or if we just set the URL as part of the container envs
 * @param network
 * @returns
 */
function getBaseUrl(network: Network): string {
    switch (network) {
        case 'cardano-mainnet':
            return 'https://cardano-mainnet.blockfrost.io/api/v0';
        case 'cardano-preprod':
            return 'https://cardano-preprod.blockfrost.io/api/v0';
        case 'cardano-preview':
            return 'https://cardano-preview.blockfrost.io/api/v0';
    }
}

export interface BlockfrostDataSource {
    getRewardsHistory(stakeAddress: string): Promise<Reward[]>;
    getPoolInfo(poolId: string): Promise<Pool | undefined>;
    getPools(): Promise<Pool[]>;
    postTransactionSubmit(cbor: string): Promise<string>;
}

export class BlockfrostAPIDataSource implements BlockfrostDataSource {
    private apiKey: string;
    private network: Network;

    constructor(apiKey: string, network: Network) {
        this.apiKey = apiKey;
        this.network = network;
    }

    public async getRewardsHistory(stakeAddress: string): Promise<Reward[]> {
        // @TODO: Add pagination query params
        const requestConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `${getBaseUrl(this.network)}/accounts/${stakeAddress}/rewards`,
            headers: { project_id: this.apiKey },
        };

        try {
            const response = await axios(requestConfig);
            return response.data.map((r: Reward) => {
                return r;
            });
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to fetch rewards history for stake address: ${stakeAddress}`);
        }
    }

    public async getPoolInfo(poolId: string): Promise<Pool | undefined> {
        const requestConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `${getBaseUrl(this.network)}/pools/${poolId}`,
            headers: { project_id: this.apiKey },
        };

        try {
            const response = await axios(requestConfig);

            const pool: Pool = {
                ...response.data,
            };

            return pool;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to fetch information for pool with id: ${poolId}`);
        }
    }

    public async getPools(): Promise<Pool[]> {
        const requestConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `${getBaseUrl(this.network)}/pools/`,
            headers: { project_id: this.apiKey },
        };

        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to fetch pools`);
        }
    }

    public async postTransactionSubmit(cbor: string): Promise<string> {
        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${getBaseUrl(this.network)}/tx/submit`,
            headers: { project_id: this.apiKey, 'Content-Type': 'application/cbor' },
            data: JSON.stringify(cbor),
        };
        try {
            const response = await axios(requestConfig);

            // Returns the id of the submitted transaction
            return response.data;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post transaction with cbor: ${cbor}`);
        }
    }
}
