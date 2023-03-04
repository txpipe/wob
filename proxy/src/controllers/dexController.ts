import { Route, Controller, Tags, Post, Body, Example } from 'tsoa';
import { DexLastPriceRequestBody, DexMeanPriceRequestBody, DexSwapPriceRequestBody } from '../model/requests';
import { CarpService } from '../services/carpService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';
import { Dex, DexLastPrice, DexMeanPrice, DexSwap, Direction } from '../model/carp';

@Tags('Dex')
@Route('dex')
@ProvideSingleton(DexController)
export class DexController extends Controller {
    constructor(@inject(CarpService) private carpService: CarpService) {
        super();
    }

    @Example<DexLastPrice[]>([
        {
            dex: Dex.WingRiders,
            amount2: '2042352568679',
            amount1: '2042352568679',
            asset2: {
                assetName: '42657272794e617679',
                policyId: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
            },
            asset1: {
                assetName: '42657272794e617679',
                policyId: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
            },
        },
    ])
    @Post('/last-price')
    public async getLastPrice(@Body() requestBody: DexLastPriceRequestBody): Promise<DexLastPrice[]> {
        return this.carpService.getLastPrice(requestBody.assetPairs, requestBody.type);
    }

    @Example<DexMeanPrice[]>([
        {
            amount2: '2042352568679',
            amount1: '2042352568679',
            asset2: {
                assetName: '42657272794e617679',
                policyId: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
            },
            asset1: {
                assetName: '42657272794e617679',
                policyId: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
            },
            dex: Dex.WingRiders,
            tx_hash: 'string',
        },
    ])
    @Post('/mean-price')
    public async getMeanPrice(@Body() requestBody: DexMeanPriceRequestBody): Promise<DexMeanPrice[]> {
        return this.carpService.getMeanPrice(requestBody.assetPairs, requestBody.dexes, requestBody.limit);
    }

    @Example<DexSwap[]>([
        {
            direction: Direction.Buy,
            amount2: '2042352568679',
            amount1: '2042352568679',
            asset2: {
                assetName: '42657272794e617679',
                policyId: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
            },
            asset1: {
                assetName: '42657272794e617679',
                policyId: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
            },
            dex: Dex.WingRiders,
            tx_hash: 'string',
        },
    ])
    @Post('/swap-price')
    public async getSwapPrice(@Body() requestBody: DexSwapPriceRequestBody): Promise<DexSwap[]> {
        return this.carpService.getSwapPrice(requestBody.dexes, requestBody.assetPairs, requestBody.limit);
    }
}
