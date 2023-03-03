import { Get, Route, Controller, Tags, Query } from 'tsoa';
import { CarpAPIDataSource } from '../dataSource/carp';
import { Block } from '../model/carp';
import { CarpService } from '../services/carpService';

@Tags('Block')
@Route('block')
export class BlockController extends Controller {
    private carpService: CarpService;

    // TODO: Inject services in constructor
    constructor() {
        super();
        this.carpService = new CarpService(new CarpAPIDataSource(process.env.CARP_HOST!));
    }

    @Get('/latest')
    public async getLatest(@Query() offset: number): Promise<Block | undefined> {
        return this.carpService.getBlockLatest(offset);
    }
}
