import { Route, Controller, Tags, Post, Body } from 'tsoa';
import { DexLastPriceRequestBody, DexMeanPriceRequestBody, DexSwapPriceRequestBody } from '../model/requests';
import { CarpService } from '../services/carpService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';
import { DexLastPrice, DexMeanPrice, DexSwap } from '../model/carp';

@Tags('Dex')
@Route('dex')
@ProvideSingleton(DexController)
export class DexController extends Controller {
    constructor(@inject(CarpService) private carpService: CarpService) {
        super();
    }

    @Post('/last-price')
    public async getLastPrice(@Body() requestBody: DexLastPriceRequestBody): Promise<DexLastPrice[]> {
        return this.carpService.getLastPrice(requestBody.assetPairs, requestBody.type);
    }

    @Post('/mean-price')
    public async getMeanPrice(@Body() requestBody: DexMeanPriceRequestBody): Promise<DexMeanPrice[]> {
        return this.carpService.getMeanPrice(requestBody.assetPairs, requestBody.dexes, requestBody.limit);
    }

    @Post('/swap-price')
    public async getSwapPrice(@Body() requestBody: DexSwapPriceRequestBody): Promise<DexSwap[]> {
        return this.carpService.getSwapPrice(requestBody.dexes, requestBody.assetPairs, requestBody.limit);
    }
}
