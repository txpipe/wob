import {
  BlockfrostAPIDataSource,
  BlockfrostDataSource,
  Network,
} from "../dataSource/blockfrost";
import { Pool } from "../model/blockfrost";

class BlockfrostController {
  private dataSource: BlockfrostDataSource;

  constructor(dataSource: BlockfrostDataSource) {
    this.dataSource = dataSource;
  }

  public async getRewardsHistory(stakeAddress: string): Promise<unknown[]> {
    return this.dataSource.getRewardsHistory(stakeAddress);
  }

  public async getPoolInfo(poolId: string): Promise<Pool | undefined> {
    const result = await this.dataSource.getPoolInfo(poolId);
    return result;
  }

  public async postTransactionSubmit(cbor: string): Promise<unknown[]> {
    const result = await this.dataSource.postTransactionSubmit(cbor);
    return [];
  }
}

// @TODO: Instantiate the real data source and insert api key from config
export const blockfrostController = new BlockfrostController(
  new BlockfrostAPIDataSource(
    process.env.BLOCKFROST_API_KEY!,
    process.env.BLOCKFROST_NETWORK as Network
  )
);
