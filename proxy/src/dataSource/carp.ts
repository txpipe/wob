import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestError, NotFoundError } from '../api/errors';
import {
    Address,
    AddressAfter,
    Asset,
    AssetName,
    Block,
    Cip25Response,
    Dex,
    DexLastPrice,
    DexMeanPrice,
    DexSwap,
    PriceType,
    TransactionData,
    UtxoData,
    UtxoPointer,
} from '../model/carp';
import { ProvideSingleton } from '../ioc';
import dotenv from 'dotenv';

dotenv.config();

export interface CarpDataSource {
    getAddressUsed(addresses: Address[], after: AddressAfter, untilBlock: string): Promise<string[]>;
    getBlockLatest(offset: number): Promise<Block | undefined>;
    getMetadataNft(assets: { [policyId: string]: AssetName[] }): Promise<Cip25Response>;
    getTransactionHistory(
        addresses: string[],
        after: AddressAfter,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<TransactionData[]>;
    getTransactionOutput(utxoPointers: UtxoPointer[]): Promise<UtxoData[]>;
    getLastPrice(assetPairs: { asset1: Asset; asset2: Asset }[], type: PriceType): Promise<DexLastPrice[]>;
    getMeanPrice(assetPairs: { asset1: Asset; asset2: Asset }[], dexes: Array<Dex>, limit?: number): Promise<DexMeanPrice[]>;
    getSwapPrice(dexes: Array<Dex>, assetPairs: { asset1: Asset; asset2: Asset }[], limit?: number): Promise<DexSwap[]>;
}

@ProvideSingleton(CarpAPIDataSource)
export class CarpAPIDataSource implements CarpDataSource {
    private host: string;

    constructor() {
        this.host = process.env.CARP_HOST!;
    }

    /**
    Ordered lexicographically (order is not maintained)
    Warning: the pagination on this endpoint is NOT whether or not an address was used during this block interval, but rather whether or not the address was first used within this interval.
    Note: this endpoint only returns addresses that are in a block.
   * @param addresses 
   * @param afterTx 
   * @param afterBlock 
   * @param untilBlock 
   * @returns 
   */
    public async getAddressUsed(addresses: Address[], after: AddressAfter, untilBlock: string): Promise<string[]> {
        const data = {
            addresses,
            after,
            untilBlock,
        };

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/address/used`,
            data,
        };

        try {
            const response = await axios(requestConfig);
            return response.data?.addresses || [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post address used`);
        }
    }

    /**
     * Get the latest block. Useful for checking synchronization process and pagination
     * @param offset
     */
    public async getBlockLatest(offset: number): Promise<Block | undefined> {
        const data = {
            offset,
        };

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/block/latest`,
            data,
        };

        try {
            const response = await axios(requestConfig);

            if (response.data.block) {
                const block: Block = {
                    ...response.data.block,
                };
                return block;
            }
            throw new NotFoundError('unable to post block latest');
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post block latest`);
        }
    }

    /**
     * Gets the CIP25 metadata for given <policy, asset_name> pairs
     * @param assets
     */
    public async getMetadataNft(assets: { [policyId: string]: AssetName[] }): Promise<Cip25Response> {
        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/metadata/nft`,
            data: assets,
        };

        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post metadata nft`);
        }
    }

    /**
     * Ordered by <block.height, transaction.tx_index>
       Note: this endpoint only returns txs that are in a block. Use another tool to see mempool for txs not in a block
     * @param addresses 
     * @param afterTx 
     * @param afterBlock 
     * @param untilBlock 
     * @param limit 
     * @param relationFilter 
     * @returns 
     */
    public async getTransactionHistory(
        addresses: Address[],
        after: AddressAfter,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<TransactionData[]> {
        const data = {
            addresses,
            after,
            untilBlock,
            limit,
            relationFilter,
        };

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/transaction/history`,
            data,
        };

        try {
            const response = await axios(requestConfig);
            if (response.data.transactions) {
                return response.data.transactions.map((t: TransactionData) => t);
            }
            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post transaction history`);
        }
    }

    /**
     * Executes a post to the carp api for getting the outputs for given <tx hash, output index> pairs.
     * @param utxoPointers
     * @returns
     */
    public async getTransactionOutput(utxoPointers: UtxoPointer[]): Promise<UtxoData[]> {
        const data = {
            utxoPointers,
        };

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/transaction/output`,
            data,
        };

        try {
            const response = await axios(requestConfig);

            if (response.data.utxos) {
                return response.data.utxos.map((t: UtxoData) => t);
            }

            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post transaction output`);
        }
    }

    /**
     * Executes a post to the carp api for getting the last price
     * @param assetPairs
     * @param type
     * @returns
     */
    public async getLastPrice(assetPairs: { asset1: Asset; asset2: Asset }[], type: PriceType): Promise<DexLastPrice[]> {
        const data = {
            assetPairs,
            type,
        };

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/dex/last-price`,
            data,
        };

        try {
            const response = await axios(requestConfig);
            if (response.data.lastPrice) {
                return response.data.lastPrice;
            }
            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post /dex/last-price`);
        }
    }

    /**
     * Executes a post to the carp api for getting the mean price
     * @param assetPairs
     * @param dexes
     * @param limit
     * @returns
     */
    public async getMeanPrice(assetPairs: { asset1: Asset; asset2: Asset }[], dexes: Array<Dex>, limit?: number): Promise<DexMeanPrice[]> {
        const data = {
            assetPairs,
            dexes,
            limit,
        };

        // @TODO: Include pagination with after / until

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/dex/mean-price`,
            data,
        };

        try {
            const response = await axios(requestConfig);
            if (response.data.meanPrices) {
                return response.data.meanPrices;
            }
            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post /dex/mean-price`);
        }
    }

    /**
     * Executes a post to the carp api for getting the swap price
     * @param dexes
     * @param assetPairs
     * @param limit
     * @returns
     */
    public async getSwapPrice(dexes: Array<Dex>, assetPairs: { asset1: Asset; asset2: Asset }[], limit?: number): Promise<DexSwap[]> {
        const data = {
            assetPairs,
            dexes,
            limit,
        };

        // @TODO: Include pagination with after / until

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/dex/swap-price`,
            data,
        };

        try {
            const response = await axios(requestConfig);
            if (response.data.swap) {
                return response.data.swap;
            }
            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post /dex/swap-price`);
        }
    }
}
