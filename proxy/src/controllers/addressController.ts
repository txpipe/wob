import { Get, Route, Controller, Path, Tags, Post, Body } from 'tsoa';
import { BlockfrostAPIDataSource, Network } from '../dataSource/blockfrost';
import { CarpAPIDataSource } from '../dataSource/carp';
import { ScrollsRedisDataSource } from '../dataSource/scrolls';
import { AddressUsedRequestBody } from '../model/requests';
import { Reward } from '../model/blockfrost';
import { AdaHandle } from '../model/scrolls';
import { BlockfrostService } from '../services/blockfrostService';
import { CarpService } from '../services/carpService';
import { ScrollsService } from '../services/scrollsService';

@Tags('Address')
@Route('address')
export class AddressController extends Controller {
    private scrollsService: ScrollsService;
    private carpService: CarpService;
    private blockfrostService: BlockfrostService;

    // TODO: Inject services in constructor
    constructor() {
        super();

        this.scrollsService = new ScrollsService(new ScrollsRedisDataSource(process.env.SCROLLS_URL!));
        this.carpService = new CarpService(new CarpAPIDataSource(process.env.CARP_HOST!));
        this.blockfrostService = new BlockfrostService(
            new BlockfrostAPIDataSource(process.env.BLOCKFROST_API_KEY!, process.env.BLOCKFROST_NETWORK as Network),
        );
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
        return this.carpService.getAddressUsed(requestBody.addresses, requestBody.after.tx, requestBody.after.block, requestBody.untilBlock);
    }
}
