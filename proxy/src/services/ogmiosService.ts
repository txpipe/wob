import { OgmiosDataSource } from '../dataSource/ogmios';
import { DelegationAndRewards } from '../model/ogmios';

export class OgmiosService {
    private dataSource: OgmiosDataSource;

    constructor(dataSource: OgmiosDataSource) {
        this.dataSource = dataSource;
    }

    public async getDelegationsAndRewards(stakeKeyHashes: string[]): Promise<{[account: string]: DelegationAndRewards}> {
        const data = await this.dataSource.getDelegationsAndRewards(stakeKeyHashes);
        const response: {[account: string]: DelegationAndRewards} = {};
        Object.entries(data).forEach(([account, delegationAndRewards]) => {
            response[account] = { delegate: delegationAndRewards.delegate, rewards: Number(delegationAndRewards.rewards)}
        })
        return response;
    }
}