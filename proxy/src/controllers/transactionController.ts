import { Route, Controller, Tags, Post, Body } from 'tsoa';
import { BlockfrostAPIDataSource, Network } from '../dataSource/blockfrost';
import { CarpAPIDataSource } from '../dataSource/carp';
import { TransactionData, UtxoData } from '../model/carp';
import { TransactionHistoryRequestBody, TransactionOutputRequestBody, TransactionSubmitRequestBody } from '../model/requests';
import { BlockfrostService } from '../services/blockfrostService';
import { CarpService } from '../services/carpService';

@Tags('Transaction')
@Route('transaction')
export class TransactionController extends Controller {
    private carpService: CarpService;
    private blockfrostService: BlockfrostService;

    // TODO: Inject services in constructor
    constructor() {
        super();
        this.carpService = new CarpService(new CarpAPIDataSource(process.env.CARP_HOST!));
        this.blockfrostService = new BlockfrostService(
            new BlockfrostAPIDataSource(process.env.BLOCKFROST_API_KEY!, process.env.BLOCKFROST_NETWORK as Network),
        );
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
