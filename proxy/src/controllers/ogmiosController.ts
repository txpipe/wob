import { DelegationAndRewardsByAccount, OgmiosClientDataSource, OgmiosDataSource } from '../dataSource/ogmios';
import { DelegationAndRewards } from '../model/ogmios';

class OgmiosController {
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

export const ogmiosController = new OgmiosController(new OgmiosClientDataSource(process.env.OGMIOS_HOST!, Number(process.env.OGMIOS_PORT!)));
