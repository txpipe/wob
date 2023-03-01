import { BlockfrostAPIDataSource, BlockfrostDataSource, Network } from '../dataSource/blockfrost';
import { Pool } from '../model/blockfrost';

class BlockfrostController {
    private dataSource: BlockfrostDataSource;

    constructor(dataSource: BlockfrostDataSource) {
        this.dataSource = dataSource;
    }

    public async getRewardsHistory(stakeAddress: string): Promise<unknown[]> {
        return this.dataSource.getRewardsHistory(stakeAddress);
    }

    public async getPoolInfo(poolId: string): Promise<Pool | undefined> {
        return await this.dataSource.getPoolInfo(poolId);
    }

    public async postTransactionSubmit(cbor: string): Promise<string> {
        return await this.dataSource.postTransactionSubmit(cbor);
    }
}

export const blockfrostController = new BlockfrostController(
    new BlockfrostAPIDataSource(process.env.BLOCKFROST_API_KEY!, process.env.BLOCKFROST_NETWORK as Network),
);
