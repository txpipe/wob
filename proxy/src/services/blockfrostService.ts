import { BlockfrostAPIDataSource, BlockfrostDataSource } from '../dataSource/blockfrost';
import { Pool, Reward } from '../model/blockfrost';
import { ProvideSingleton } from '../ioc';
import { inject } from 'inversify';

@ProvideSingleton(BlockfrostService)
export class BlockfrostService {
    constructor(@inject(BlockfrostAPIDataSource) private dataSource: BlockfrostDataSource) {}

    public async getRewardsHistory(stakeAddress: string): Promise<Reward[]> {
        return this.dataSource.getRewardsHistory(stakeAddress);
    }

    public async getPoolInfo(poolId: string): Promise<Pool | undefined> {
        return await this.dataSource.getPoolInfo(poolId);
    }

    public async getPools(): Promise<Pool[]> {
        return await this.dataSource.getPools();
    }

    public async postTransactionSubmit(cbor: string): Promise<string> {
        return await this.dataSource.postTransactionSubmit(cbor);
    }
}
