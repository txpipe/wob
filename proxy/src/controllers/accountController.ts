import { Route, Controller, Tags, Post, Body, Example } from 'tsoa';
import { AccountDelegationAndRewardsRequestBody } from '../model/requests';
import { DelegationAndRewards } from '../model/ogmios';
import { OgmiosService } from '../services/ogmiosService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';

@Tags('Account')
@Route('account')
@ProvideSingleton(AccountController)
export class AccountController extends Controller {
    constructor(@inject(OgmiosService) private ogmiosService: OgmiosService) {
        super();
    }

    /**
     * Implemented by `Ogmios` Service Provider
     * 
     * Returns the delegation and rewards by account given a list of addresses
     * @param requestBody 
     * @returns delegation and rewards by account
     */
    @Example<{ [account: string]: DelegationAndRewards }>({
        '7353517eef637f3df6f2e8a49e013676c4b003320ceab31797229cc6': {
            delegate: 'pool132jxjzyw4awr3s75ltcdx5tv5ecv6m042306l630wqjckhfm32r',
            rewards: 0,
        },
    })
    @Post('/state')
    public async getDelegationAndRewards(
        @Body() requestBody: AccountDelegationAndRewardsRequestBody,
    ): Promise<{ [account: string]: DelegationAndRewards }> {
        return this.ogmiosService.getDelegationsAndRewards(requestBody.stakeKeyHashes);
    }
}
