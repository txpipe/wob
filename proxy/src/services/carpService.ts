import { CarpAPIDataSource, CarpDataSource } from '../dataSource/carp';
import { AssetName, Block, CIP25, TransactionData, UtxoData, UtxoPointers } from '../model/carp';
import { ProvideSingleton } from '../ioc';
import { inject } from 'inversify';

@ProvideSingleton(CarpService)
export class CarpService {
    constructor(@inject(CarpAPIDataSource) private dataSource: CarpDataSource) {}

    public async getAddressUsed(addresses: string[], afterTx: string, afterBlock: string, untilBlock: string): Promise<string[]> {
        return this.dataSource.getAddressUsed(addresses, afterTx, afterBlock, untilBlock);
    }

    public async getBlockLatest(offset: number): Promise<Block | undefined> {
        return this.dataSource.getBlockLatest(offset);
    }

    public async getMetadataNft(assets: { [policyId: string]: AssetName[] }): Promise<CIP25[]> {
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
