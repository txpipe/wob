import { OgmiosClientDataSource, OgmiosDataSource } from '../dataSource/ogmios';
import { DelegationAndRewards } from '../model/ogmios';
import { ProvideSingleton } from '../ioc';
import { inject } from 'inversify';

@ProvideSingleton(OgmiosService)
export class OgmiosService {
    constructor(@inject(OgmiosClientDataSource) private dataSource: OgmiosDataSource) {}

    public async getDelegationsAndRewards(stakeKeyHashes: string[]): Promise<{ [account: string]: DelegationAndRewards }> {
        const data = await this.dataSource.getDelegationsAndRewards(stakeKeyHashes);
        const response: { [account: string]: DelegationAndRewards } = {};
        Object.entries(data).forEach(([account, delegationAndRewards]) => {
            response[account] = { delegate: delegationAndRewards.delegate, rewards: Number(delegationAndRewards.rewards) };
        });
        return response;
    }
}
