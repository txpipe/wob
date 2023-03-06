import { Get, Route, Controller, Tags, Query, Example } from 'tsoa';
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

    /**
     * Implemented by `CARP` Service Provider
     *
     * Get the latest block. Useful for checking synchronization process and pagination
     *
     * @param offset
     * @returns latest block information
     */
    @Example<Block>({
        slot: 4924800,
        epoch: 209,
        height: 4512067,
        hash: 'cf8c63a909d91776e27f7d05457e823a9dba606a7ab499ac435e7904ee70d7c8',
        era: 1,
        isValid: true,
        indexInBlock: 0,
    })
    @Get('/latest')
    public async getLatest(@Query() offset: number): Promise<Block | undefined> {
        return this.carpService.getBlockLatest(offset);
    }
}
