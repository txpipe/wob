import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestError } from '../api/errors';
import { Asset, Block, CIP25, UtxoPointers } from '../model/carp';

export interface CarpDataSource {
    getAddressUsed(addresses: string[], afterTx: string, afterBlock: string, untilBlock: string): Promise<string[]>;
    getBlockLatest(offset: number): Promise<Block | undefined>;
    getMetadataNft(assets: Asset[]): Promise<CIP25[]>;
    getTransactionHistory(
        addresses: string[],
        afterTx: string,
        afterBlock: string,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<unknown[]>;
    getTransactionOutput(utxoPointers: UtxoPointers[]): Promise<unknown[]>;
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
    public async getMetadataNft(assets: Asset[]): Promise<CIP25[]> {
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
                // @TODO: process response
                // {
                //   "cip25": {
                //      "b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f": {
                //          "42657272794e617679": "a365636f6c6f72672330303030383065696d616765783a697066733a2f2f697066732f516d534b593167317a5375506b3536635869324b38524e766961526b44485633505a756a7474663755676b343379646e616d656a4265727279204e617679"
                //      }
                //   }
                // }
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
    ): Promise<unknown[]> {
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
                // @TODO: process response
                // [
                //   {
                //   "transaction": {
                //   "payload": "84a500818258209cb4f8c2eecccc9f1e13768046f37ef56dcb5a4dc44f58907fe4ae21d7cf621d020181825839019cb581f4337a6142e477af6e00fe41b1fc4a5944a575681b8499a3c0bd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f71b0000000586321393021a0002a389031a004b418c048183028200581cbd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f7581c53215c471b7ac752e3ddf8f2c4c1e6ed111857bfaa675d5e31ce8bcea1008282582073e584cda9fe483fbefb81c251e616018a2b493ef56820f0095b63adede54ff758404f13df42ef1684a3fd55255d8368c9ecbd15b55e2761a2991cc4f401a753c16d6da1da158e84b87b4de9715af7d9adc0d79a7c1f2c3097228e02b20be4616a0c82582066c606974819f457ceface78ee3c4d181a84ca9927a3cfc92ef8c0b6dd4576e8584014ae9ee9ed5eb5700b6c5ac270543671f5d4f943d4726f4614dc061174ee29db44b9e7fc58e6c98c13fad8594f2633c5ec70a9a87f5cbf130308a42edb553001f5f6",
                //   "hash": "011b86557367525891331b4bb985545120efc335b606d6a1c0d5a35fb330f421"
                //   },
                //   "block": {
                //   "slot": 4924800,
                //   "epoch": 209,
                //   "height": 4512067,
                //   "hash": "cf8c63a909d91776e27f7d05457e823a9dba606a7ab499ac435e7904ee70d7c8",
                //   "era": 1,
                //   "isValid": true,
                //   "indexInBlock": 0
                //   }
                //   }
                //   ]
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
    public async getTransactionOutput(utxoPointers: UtxoPointers[]): Promise<unknown[]> {
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
                // @TODO: process response
                // {
                //   "utxos": [
                //   {
                //   "utxo": {
                //   "index": 0,
                //   "txHash": "011b86557367525891331b4bb985545120efc335b606d6a1c0d5a35fb330f421",
                //   "payload": "825839019cb581f4337a6142e477af6e00fe41b1fc4a5944a575681b8499a3c0bd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f71b0000000586321393"
                //   },
                //   "block": {
                //   "slot": 4924800,
                //   "epoch": 209,
                //   "height": 4512067,
                //   "hash": "cf8c63a909d91776e27f7d05457e823a9dba606a7ab499ac435e7904ee70d7c8",
                //   "era": 1,
                //   "isValid": true,
                //   "indexInBlock": 0
                //   }
                //   }
                //   ]
                //   }
            }

            return [];
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to post transaction output`);
        }
    }
}
