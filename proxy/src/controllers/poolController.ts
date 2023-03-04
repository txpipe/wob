import { Get, Route, Controller, Tags, Path, Example } from 'tsoa';
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

    /**
     * Returns the information of a pool given an id
     * @param poolId 
     * @returns 
     */
    @Example<Pool>({
        pool_id: 'pool16h8ugt8k0a4kxa5g6x062zjrgfjc7cehpw0ze8374axlul76932',
        hex: 'd5cfc42cf67f6b637688d19fa50a4342658f63370b9e2c9e3eaf4dfe',
        vrf_key: '4331f2905796fd9a028c17896ce5305dc1daf710ad448a3872df75722f2cc41d',
        blocks_minted: 92288,
        blocks_epoch: 39,
        live_stake: '2000008055390',
        live_size: 0.016279451836816908,
        live_saturation: 0.0333260241836345,
        live_delegators: 2,
        active_stake: '2000008055390',
        active_size: 0.016334568024815296,
        declared_pledge: '100000000000000',
        live_pledge: '1000008055390',
        margin_cost: 1,
        fixed_cost: '500000000',
        reward_account: 'stake_test1uzuklnhnhy634a5rf0v9pcaf0pva002mw2wjf0ekg6h2encat3ykr',
        owners: ['stake_test1uzapf83wydusjln97rqr7fen6vgrz5087yqdxm0akqdqkgstjz8g4'],
        registration: ['e3ca57e8f323265742a8f4e79ff9af884c9ff8719bd4f7788adaea4c33ba07b6'],
        retirement: [],
    })
    @Get('/{poolId}')
    public async getPoolInfo(@Path() poolId: string): Promise<Pool | undefined> {
        return this.blockfrostService.getPoolInfo(poolId);
    }

    /**
     * Returns a list of pool ids
     * @returns 
     */
    @Example<string[]>([
        'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
        'pool1hn7hlwrschqykupwwrtdfkvt2u4uaxvsgxyh6z63703p2knj288',
        'pool1ztjyjfsh432eqetadf82uwuxklh28xc85zcphpwq6mmezavzad2',
    ])
    @Get('/')
    public async getPools(): Promise<string[]> {
        return this.blockfrostService.getPools();
    }
}
