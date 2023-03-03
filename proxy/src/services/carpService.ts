import { CarpAPIDataSource, CarpDataSource } from '../dataSource/carp';
import { Address, AddressAfter, AssetName, Block, CIP25, TransactionData, UtxoData, UtxoPointer } from '../model/carp';
import { ProvideSingleton } from '../ioc';
import { inject } from 'inversify';

@ProvideSingleton(CarpService)
export class CarpService {
    constructor(@inject(CarpAPIDataSource) private dataSource: CarpDataSource) {}

    public async getAddressUsed(addresses: Address[], after: AddressAfter, untilBlock: string): Promise<string[]> {
        return this.dataSource.getAddressUsed(addresses, after, untilBlock);
    }

    public async getBlockLatest(offset: number): Promise<Block | undefined> {
        return this.dataSource.getBlockLatest(offset);
    }

    public async getMetadataNft(assets: { [policyId: string]: AssetName[] }): Promise<CIP25[]> {
        return this.dataSource.getMetadataNft(assets);
    }

    public async getTransactionHistory(
        addresses: Address[],
        after: AddressAfter,
        untilBlock: string,
        limit?: number,
        relationFilter?: number,
    ): Promise<TransactionData[]> {
        return this.getTransactionHistory(addresses, after, untilBlock, limit, relationFilter);
    }

    public async getTransactionOutput(utxoPointers: UtxoPointer[]): Promise<UtxoData[]> {
        return this.dataSource.getTransactionOutput(utxoPointers);
    }
}
