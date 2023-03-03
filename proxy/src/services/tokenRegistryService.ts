import { TokenRegistryDataSource } from '../dataSource/tokenRegistry';
import { TokenInfo } from '../model/tokenRegistry';

export class TokenRegistryService {
    private dataSource: TokenRegistryDataSource;

    constructor(dataSource: TokenRegistryDataSource) {
        this.dataSource = dataSource;
    }

    public async getTokenMetadata(policyId: string, assetName: string): Promise<TokenInfo> {
        // Sends the subject as the concatenation of the policyId and asset name
        return await this.dataSource.getTokenMetadata(`${policyId}${assetName}`);
    }
}