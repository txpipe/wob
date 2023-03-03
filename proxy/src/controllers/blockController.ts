import { Get, Route, Controller, Tags, Query } from 'tsoa';
import { Block } from '../model/carp';
import { CarpService } from '../services/carpService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';

@Tags('Block')
@Route('block')
@ProvideSingleton(BlockController)
export class BlockController extends Controller {
    constructor(@inject(CarpService) private carpService: CarpService) {
        super();
    }

    @Get('/latest')
    public async getLatest(@Query() offset: number): Promise<Block | undefined> {
        return this.carpService.getBlockLatest(offset);
    }
}
