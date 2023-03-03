import { TokenRegistryAPIDataSource, TokenRegistryDataSource } from '../dataSource/tokenRegistry';
import { TokenInfo } from '../model/tokenRegistry';
import { ProvideSingleton } from '../ioc';
import { inject } from 'inversify';

@ProvideSingleton(TokenRegistryService)
export class TokenRegistryService {
    constructor(@inject(TokenRegistryAPIDataSource) private dataSource: TokenRegistryDataSource) {}

    public async getTokenMetadata(policyId: string, assetName: string): Promise<TokenInfo> {
        // Sends the subject as the concatenation of the policyId and asset name
        return await this.dataSource.getTokenMetadata(`${policyId}${assetName}`);
    }
}
