import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestError } from '../api/errors';
import { AssetInput, Block, CIP25, TransactionData, UtxoData, UtxoPointers } from '../model/carp';

export interface CarpDataSource {
    getAddressUsed(addresses: string[], afterTx: string, afterBlock: string, untilBlock: string): Promise<string[]>;
    getBlockLatest(offset: number): Promise<Block | undefined>;
    getMetadataNft(assets: AssetInput[]): Promise<CIP25[]>;
    getTransactionHistory(
        addresses: string[],
        afterTx: string,
        afterBlock: string,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<TransactionData[]>;
    getTransactionOutput(utxoPointers: UtxoPointers[]): Promise<UtxoData[]>;
}

export class CarpAPIDataSource implements CarpDataSource {
    private host: string;

    constructor(host: string) {
        this.host = host;
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
    public async getAddressUsed(addresses: string[], afterTx: string, afterBlock: string, untilBlock: string): Promise<string[]> {
        const data = {
            addresses,
            after: {
                tx: afterTx,
                block: afterBlock,
            },
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

            return undefined;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post block latest`);
        }
    }

    /**
     * Gets the CIP25 metadata for given <policy, asset_name> pairs
     * @param assets
     */
    public async getMetadataNft(assets: AssetInput[]): Promise<CIP25[]> {
        const data = {
            assets: {} as { [policyId: string]: string[] },
        };

        assets.forEach(a => {
            data.assets[a.policyId] = a.assetNames;
        });

        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.host}/metadata/nft`,
            data,
        };

        try {
            const response = await axios(requestConfig);

            if (response.data.cip25) {
                return Object.entries(response.data.cip25).map(([policyId, assets]) => {
                    const cip25: CIP25 = {
                        policyId,
                        assets: Object.entries(assets as { name: string, metadata: string }).map(([name, metadata]) => ({ name, metadata })),
                    };
                    return cip25;
                });
            }
            return [];
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
        addresses: string[],
        afterTx: string,
        afterBlock: string,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<TransactionData[]> {
        
        const data = {
            addresses,
            after: {
                tx: afterTx,
                block: afterBlock,
            },
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
                return response.data.transactions.map((t: TransactionData) => (t));
            }
            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post transaction history`);
        }
    }

    /**
     * Get the outputs for given <tx hash, output index> pairs.
     * @param utxoPointers
     * @returns
     */
    public async getTransactionOutput(utxoPointers: UtxoPointers[]): Promise<UtxoData[]> {
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
                return response.data.utxos.map((t: UtxoData) => (t));
            }

            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post transaction output`);
        }
    }
}
