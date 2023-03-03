import { Get, Route, Controller, Path, Tags, Post, Body } from 'tsoa';
import { CarpAPIDataSource } from '../dataSource/carp';
import { TokenRegistryAPIDataSource } from '../dataSource/tokenRegistry';
import { MetadataNftRequestBody } from '../model/requests';
import { CIP25 } from '../model/carp';
import { TokenInfo } from '../model/tokenRegistry';
import { CarpService } from '../services/carpService';
import { TokenRegistryService } from '../services/tokenRegistryService';

@Tags('Assets')
@Route('assets')
export class AssetsController extends Controller {
    private carpService: CarpService;
    private tokenRegistryService: TokenRegistryService;

    // TODO: Inject services in constructor
    constructor() {
        super();
        this.carpService = new CarpService(new CarpAPIDataSource(process.env.CARP_HOST!));
        this.tokenRegistryService = new TokenRegistryService(new TokenRegistryAPIDataSource(process.env.TOKEN_REGISTRY_URL!));
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
