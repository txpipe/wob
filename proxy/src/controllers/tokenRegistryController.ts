import { TokenRegistryAPIDataSource, TokenRegistryDataSource } from '../dataSource/tokenRegistry';
import { TokenInfo } from '../model/tokenRegistry';

class TokenRegistryController {
    private dataSource: TokenRegistryDataSource;

    constructor(dataSource: TokenRegistryDataSource) {
        this.dataSource = dataSource;
    }

    public async getTokenMetadata(policyId: string, name: string): Promise<TokenInfo> {
        // Sends the subject ast the concatenation of the policyId and asset name
        return await this.dataSource.getTokenMetadata(`${policyId}${name}`);
    }
}

export const tokenRegistryController = new TokenRegistryController(new TokenRegistryAPIDataSource(process.env.TOKEN_REGISTRY_URL!));
