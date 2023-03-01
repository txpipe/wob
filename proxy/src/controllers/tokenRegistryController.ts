import { TokenRegistryAPIDataSource, TokenRegistryDataSource } from '../dataSource/tokenRegistry';

class TokenRegistryController {
    private dataSource: TokenRegistryDataSource;

    constructor(dataSource: TokenRegistryDataSource) {
        this.dataSource = dataSource;
    }

    public async getTokenMetadata(subject: string): Promise<unknown> {
        return await this.dataSource.getTokenMetadata(subject);
    }
}

export const tokenRegistryController = new TokenRegistryController(new TokenRegistryAPIDataSource(process.env.TOKEN_REGISTRY_URL!));
