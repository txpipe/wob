import { Get, Route, Controller, Path, Tags, Post, Body, Example } from 'tsoa';
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

    /**
     * Implemented by `Scrolls` Service Provider
     * 
     * Returns the address given a handle
     * 
     * @param handle 
     * @returns address for a handle
     */
    @Example<AdaHandle[]>([
        {
            key: 'luvaloho',
            value: 'addr_test1qq4drn4j46emtfydwfc0j2gtw2ty0zgwtr3k0srmjg7nwy834r3hjynmsy2cxpc04a6dkqxcsr29qfl7v9cmrd5mm89qept00g',
        },
    ])
    @Get('/handle/{handle}')
    public async getAddressForHandler(@Path() handle: string): Promise<AdaHandle[]> {
        return this.scrollsService.getAddressForHandle(handle);
    }

    /**
     * Implemented by `Blockfrost` Service Provider
     * 
     * Obtain information about the reward history of a specific account.
     * 
     * @param stakeAddress 
     * @returns reward history of a specific account
     */
    @Example<Reward[]>([
        {
            epoch: 215,
            amount: '12695385',
            pool_id: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
            type: 'member',
        },
        {
            epoch: 216,
            amount: '3586329',
            pool_id: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
            type: 'member',
        },
        {
            epoch: 217,
            amount: '1',
            pool_id: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
            type: 'member',
        },
        {
            epoch: 217,
            amount: '1337',
            pool_id: 'pool1cytwr0n7eas6du2h2xshl8ypa1yqr18f0erlhhjcuczysiunjcs',
            type: 'leader',
        },
        {
            epoch: 218,
            amount: '1395265',
            pool_id: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
            type: 'member',
        },
        {
            epoch: 218,
            amount: '500000000',
            pool_id: 'pool1cytwr0n7eas6du2h2xshl8ypa1yqr18f0erlhhjcuczysiunjcs',
            type: 'pool_deposit_refund',
        },
    ])
    @Get('/rewards/{stakeAddress}')
    public async getRewards(@Path() stakeAddress: string): Promise<Reward[]> {
        return this.blockfrostService.getRewardsHistory(stakeAddress);
    }

    /**
     * Implemented by `CARP` Service Provider
     * 
     * Ordered lexicographically (order is not maintained).
     * 
     * Warning: the pagination on this endpoint is NOT whether or not an address was used during this block interval,
     * but rather whether or not the address was first used within this interval.
     * 
     * Note: this endpoint only returns addresses that are in a block. Use another tool to see mempool information
     * @param requestBody 
     * @returns 
     */
    @Example<string[]>([
        '8200581c8baf48931c5187cd59fde553f4e7da2e1a2aa9202ec6e67815cb3f8a',
        'stake1ux236z4g4r4pztn5v69txyj2yq6a3esq5x4p4stxydra7zsnv25ue',
        'script1ffv7hkf75573h0mlsg3jc7cpyuq2pn6tk7xc08dtkx3q5ah7h47',
        'Ae2tdPwUPEZHu3NZa6kCwet2msq4xrBXKHBDvogFKwMsF18Jca8JHLRBas7',
    ])
    @Post('/used')
    public async getAddressUsed(@Body() requestBody: AddressUsedRequestBody): Promise<string[]> {
        return this.carpService.getAddressUsed(requestBody.addresses, requestBody.after, requestBody.untilBlock);
    }
}
