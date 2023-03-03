import { Get, Route, Controller, Tags, Path } from 'tsoa';
import { BlockfrostAPIDataSource, Network } from '../dataSource/blockfrost';
import { Pool } from '../model/blockfrost';
import { BlockfrostService } from '../services/blockfrostService';

@Tags('Pool')
@Route('pool')
export class PoolController extends Controller {
    private blockfrostService: BlockfrostService;

    // TODO: Inject services in constructor
    constructor() {
        super();
        this.blockfrostService = new BlockfrostService(
            new BlockfrostAPIDataSource(process.env.BLOCKFROST_API_KEY!, process.env.BLOCKFROST_NETWORK as Network),
        );
    }

    @Get('/{poolId}')
    public async getPoolInfo(@Path() poolId: string): Promise<Pool | undefined> {
        return this.blockfrostService.getPoolInfo(poolId);
    }

    @Get('/')
    public async getPools(): Promise<Pool[]> {
        return this.blockfrostService.getPools();
    }
}
