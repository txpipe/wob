import { Route, Controller, Tags, Post, Body } from 'tsoa';
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

    @Post('/history')
    public async getTransactionHistory(@Body() requestBody: TransactionHistoryRequestBody): Promise<TransactionData[]> {
        return this.carpService.getTransactionHistory(
            requestBody.addresses,
            requestBody.after.tx,
            requestBody.after.block,
            requestBody.untilBlock,
            requestBody.limit,
            requestBody.relationFilter,
        );
    }

    @Post('/output')
    public async getTransactionOutput(@Body() requestBody: TransactionOutputRequestBody): Promise<UtxoData[]> {
        return this.carpService.getTransactionOutput(requestBody.utxoPointers);
    }

    @Post('/submit')
    public async transactionSubmit(@Body() requestBody: TransactionSubmitRequestBody): Promise<string> {
        return this.blockfrostService.postTransactionSubmit(requestBody.cbor);
    }
}
