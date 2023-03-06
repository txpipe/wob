import { Route, Controller, Tags, Post, Body, Example } from 'tsoa';
import { TransactionData, UtxoData } from '../model/carp';
import { TransactionHistoryRequestBody, TransactionOutputRequestBody, TransactionSubmitRequestBody } from '../model/requests';
import { BlockfrostService } from '../services/blockfrostService';
import { CarpService } from '../services/carpService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';

@Tags('Transaction')
@Route('transaction')
@ProvideSingleton(TransactionController)
export class TransactionController extends Controller {
    constructor(@inject(BlockfrostService) private blockfrostService: BlockfrostService, @inject(CarpService) private carpService: CarpService) {
        super();
    }

    /**
     * Implemented by `CARP` Service Provider
     *
     * Ordered by `<block.height, transaction.tx_index>`
     *
     * Note: this endpoint only returns txs that are in a block. Use another tool to see mempool for txs not in a block
     * @param requestBody
     * @returns in block txs ordered by `<block.height, transaction.tx_index>`
     */
    @Example<TransactionData[]>([
        {
            transaction: {
                payload:
                    '84a500818258209cb4f8c2eecccc9f1e13768046f37ef56dcb5a4dc44f58907fe4ae21d7cf621d020181825839019cb581f4337a6142e477af6e00fe41b1fc4a5944a575681b8499a3c0bd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f71b0000000586321393021a0002a389031a004b418c048183028200581cbd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f7581c53215c471b7ac752e3ddf8f2c4c1e6ed111857bfaa675d5e31ce8bcea1008282582073e584cda9fe483fbefb81c251e616018a2b493ef56820f0095b63adede54ff758404f13df42ef1684a3fd55255d8368c9ecbd15b55e2761a2991cc4f401a753c16d6da1da158e84b87b4de9715af7d9adc0d79a7c1f2c3097228e02b20be4616a0c82582066c606974819f457ceface78ee3c4d181a84ca9927a3cfc92ef8c0b6dd4576e8584014ae9ee9ed5eb5700b6c5ac270543671f5d4f943d4726f4614dc061174ee29db44b9e7fc58e6c98c13fad8594f2633c5ec70a9a87f5cbf130308a42edb553001f5f6',
                hash: '011b86557367525891331b4bb985545120efc335b606d6a1c0d5a35fb330f421',
            },
            block: {
                slot: 4924800,
                epoch: 209,
                height: 4512067,
                hash: 'cf8c63a909d91776e27f7d05457e823a9dba606a7ab499ac435e7904ee70d7c8',
                era: 1,
                isValid: true,
                indexInBlock: 0,
            },
        },
    ])
    @Post('/history')
    public async getTransactionHistory(@Body() requestBody: TransactionHistoryRequestBody): Promise<TransactionData[]> {
        return this.carpService.getTransactionHistory(
            requestBody.addresses,
            requestBody.after,
            requestBody.untilBlock,
            requestBody.limit,
            requestBody.relationFilter,
        );
    }

    /**
     * Implemented by `CARP` Service Provider
     *
     * Get the outputs for given `<tx hash, output index>` pairs.
     *
     * This endpoint will return both used AND unused outputs
     *
     * Note: this endpoint only returns txs that are in a block. Use another tool to see mempool for txs not in a block
     * @param requestBody
     * @returns in bloxk txs, both used AND unused outputs, for a given `<tx hash, output index>` pairs.
     */
    @Example<UtxoData[]>([
        {
            utxo: {
                index: 0,
                txHash: '011b86557367525891331b4bb985545120efc335b606d6a1c0d5a35fb330f421',
                payload:
                    '825839019cb581f4337a6142e477af6e00fe41b1fc4a5944a575681b8499a3c0bd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f71b0000000586321393',
            },
            block: {
                slot: 4924800,
                epoch: 209,
                height: 4512067,
                hash: 'cf8c63a909d91776e27f7d05457e823a9dba606a7ab499ac435e7904ee70d7c8',
                era: 1,
                isValid: true,
                indexInBlock: 0,
            },
        },
    ])
    @Post('/output')
    public async getTransactionOutput(@Body() requestBody: TransactionOutputRequestBody): Promise<UtxoData[]> {
        return this.carpService.getTransactionOutput(requestBody.utxoPointers);
    }

    /**
     * Implemented by `Blockfrost` Service Provider
     *
     * Submit an already serialized transaction to the network.
     *
     * @param requestBody
     * @returns transaction id
     */
    @Example<string>('d1662b24fa9fe985fc2dce47455df399cb2e31e1e1819339e885801cc3578908')
    @Post('/submit')
    public async transactionSubmit(@Body() requestBody: TransactionSubmitRequestBody): Promise<string> {
        return this.blockfrostService.postTransactionSubmit(requestBody.cbor);
    }
}
