import { CarpAPIDataSource, CarpDataSource } from '../dataSource/carp';
import { AssetInput, Block, CIP25, TransactionData, UtxoData, UtxoPointers } from '../model/carp';

class CarpController {
    private dataSource: CarpDataSource;

    constructor(dataSource: CarpDataSource) {
        this.dataSource = dataSource;
    }

    public async getAddressUsed(addresses: string[], afterTx: string, afterBlock: string, untilBlock: string): Promise<string[]> {
        return this.dataSource.getAddressUsed(addresses, afterTx, afterBlock, untilBlock);
    }
    
    public async getBlockLatest(offset: number): Promise<Block | undefined> {
        return this.dataSource.getBlockLatest(offset);
    }

    public async getMetadataNft(assets: AssetInput[]): Promise<CIP25[]> {
        return this.dataSource.getMetadataNft(assets);
    }

    public async getTransactionHistory(
        addresses: string[],
        afterTx: string,
        afterBlock: string,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<TransactionData[]> {
        return this.getTransactionHistory(addresses, afterTx, afterBlock, untilBlock, limit, relationFilter);
    }

    public async getTransactionOutput(utxoPointers: UtxoPointers[]): Promise<UtxoData[]> {
        return this.dataSource.getTransactionOutput(utxoPointers);
    }
}

export const carpController = new CarpController(new CarpAPIDataSource(process.env.CARP_HOST!));
