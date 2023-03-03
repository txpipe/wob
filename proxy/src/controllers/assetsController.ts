import { Get, Route, Controller, Path, Tags, Post, Body } from 'tsoa';
import { MetadataNftRequestBody } from '../model/requests';
import { CIP25 } from '../model/carp';
import { TokenInfo } from '../model/tokenRegistry';
import { CarpService } from '../services/carpService';
import { TokenRegistryService } from '../services/tokenRegistryService';
import { inject } from 'inversify';
import { ProvideSingleton } from '../ioc';

@Tags('Assets')
@Route('assets')
@ProvideSingleton(AssetsController)
export class AssetsController extends Controller {
    constructor(
        @inject(TokenRegistryService) private tokenRegistryService: TokenRegistryService,
        @inject(CarpService) private carpService: CarpService,
    ) {
        super();
    }

    @Get('/metadata/{policyId}/{assetName}')
    public async getMetadata(@Path() policyId: string, @Path() assetName: string): Promise<TokenInfo> {
        return this.tokenRegistryService.getTokenMetadata(policyId, assetName);
    }

    @Post('/metadata/nft')
    public async getMetadataNft(@Body() requestBody: MetadataNftRequestBody): Promise<CIP25[]> {
        return this.carpService.getMetadataNft(requestBody.assets);
    }
}
