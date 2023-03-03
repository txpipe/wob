import { Route, Controller, Tags, Post, Body } from 'tsoa';
import { OgmiosClientDataSource } from '../dataSource/ogmios';
import { AccountDelegationAndRewardsRequestBody } from '../model/requests';
import { DelegationAndRewards } from '../model/ogmios';
import { OgmiosService } from '../services/ogmiosService';

@Tags('Account')
@Route('account')
export class AccountController extends Controller {
    private ogmiosService: OgmiosService;

    // TODO: Inject services in constructor
    constructor() {
        super();
        this.ogmiosService = new OgmiosService(new OgmiosClientDataSource(process.env.OGMIOS_HOST!, Number(process.env.OGMIOS_PORT!)));
    }

    @Post('/state')
    public async getDelegationAndRewards(@Body() requestBody: AccountDelegationAndRewardsRequestBody): Promise<{[account: string]: DelegationAndRewards}> {
        return this.ogmiosService.getDelegationsAndRewards(requestBody.stakeKeyHashes);
    }
}
