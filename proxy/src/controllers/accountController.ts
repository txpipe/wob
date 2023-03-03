import { Route, Controller, Tags, Post, Body } from 'tsoa';
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

    @Post('/state')
    public async getDelegationAndRewards(
        @Body() requestBody: AccountDelegationAndRewardsRequestBody,
    ): Promise<{ [account: string]: DelegationAndRewards }> {
        return this.ogmiosService.getDelegationsAndRewards(requestBody.stakeKeyHashes);
    }
}
