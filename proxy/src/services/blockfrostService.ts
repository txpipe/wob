import { BlockfrostDataSource } from '../dataSource/blockfrost';
import { Pool, Reward } from '../model/blockfrost';

export class BlockfrostService {
    private dataSource: BlockfrostDataSource;

    constructor(dataSource: BlockfrostDataSource) {
        this.dataSource = dataSource;
    }

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
