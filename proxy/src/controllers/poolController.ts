import { Get, Route, Controller, Tags, Path } from 'tsoa';
import { Pool } from '../model/blockfrost';
import { BlockfrostService } from '../services/blockfrostService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';

@Tags('Pool')
@Route('pool')
@ProvideSingleton(PoolController)
export class PoolController extends Controller {
    constructor(@inject(BlockfrostService) private blockfrostService: BlockfrostService) {
        super();
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
