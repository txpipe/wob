import { Get, Route, Controller, Path, Tags, Post, Body } from 'tsoa';
import { AddressUsedRequestBody } from '../model/requests';
import { Reward } from '../model/blockfrost';
import { AdaHandle } from '../model/scrolls';
import { BlockfrostService } from '../services/blockfrostService';
import { CarpService } from '../services/carpService';
import { ScrollsService } from '../services/scrollsService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';

@Tags('Address')
@Route('address')
@ProvideSingleton(AddressController)
export class AddressController extends Controller {
    constructor(
        @inject(ScrollsService) private scrollsService: ScrollsService,
        @inject(BlockfrostService) private blockfrostService: BlockfrostService,
        @inject(CarpService) private carpService: CarpService,
    ) {
        super();
    }

    @Get('/handle/{handle}')
    public async getAddressForHandler(@Path() handle: string): Promise<AdaHandle[]> {
        return this.scrollsService.getAddressForHandle(handle);
    }

    @Get('/rewards/{stakeAddress}')
    public async getRewards(@Path() stakeAddress: string): Promise<Reward[]> {
        return this.blockfrostService.getRewardsHistory(stakeAddress);
    }

    @Post('/used')
    public async getAddressUsed(@Body() requestBody: AddressUsedRequestBody): Promise<string[]> {
        return this.carpService.getAddressUsed(requestBody.addresses, requestBody.after, requestBody.untilBlock);
    }
}
