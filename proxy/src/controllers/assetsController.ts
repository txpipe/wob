import { Get, Route, Controller, Path, Tags, Post, Body, Example } from 'tsoa';
import { MetadataNftRequestBody } from '../model/requests';
import { Cip25Response } from '../model/carp';
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

    /**
     * Implemented by `Token Registry` Service Provider
     * 
     * @param policyId 
     * @param assetName 
     * @returns token information
     */
    @Example<TokenInfo>({
        name: {
            signatures: [
                {
                    publicKey: 'dc61a7b0c950fcbd1bf55d9d43c4f8120cd261f5e55745e304649998889be1b8',
                    signature:
                        '39a7d3f544dbfb519f9d6b5bf85ab1328a63c71685d1a129f29d9dc9e799e87d69e95c750775f70fae653cf52370505525e656611943bc1f6e357a790ab28a0b',
                },
            ],
            sequenceNumber: 0,
            value: 'athom',
        },
        url: {
            signatures: [
                {
                    publicKey: 'dc61a7b0c950fcbd1bf55d9d43c4f8120cd261f5e55745e304649998889be1b8',
                    signature:
                        'a5b99a25704f0fb0702b8258d1dbc183bad7b376c847e2d61a19e7b6ad168fa8786ee352e7a3ea8249f1ddb9aeef75e0a409d089cbc686cf8b2efbc50d460f0d',
                },
            ],
            sequenceNumber: 0,
            value: 'https://athom.ne0.xyz',
        },
        description: {
            signatures: [
                {
                    publicKey: 'dc61a7b0c950fcbd1bf55d9d43c4f8120cd261f5e55745e304649998889be1b8',
                    signature:
                        'fb442e3e8e20383232ac66c816d3038e000291b439f6da7dfa223c049de3c6786030ee76ed111b8525184b51f82f3f62afa9b7dc2b76f8e73fd07a67d7698e08',
                },
            ],
            sequenceNumber: 0,
            value: 'Fundamental Cardano Token',
        },
        logo: {
            signatures: [
                {
                    publicKey: 'dc61a7b0c950fcbd1bf55d9d43c4f8120cd261f5e55745e304649998889be1b8',
                    signature:
                        '241479578d97ee69776261179819978f8921851ae4a573a1780a43b72d62b2b9faba0fcc7f2b1628e1837bccfa23575daad706d850182ffcbc4a933abc10a50c',
                },
            ],
            sequenceNumber: 3,
            value: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAACGFjVEwAAAAGAAAAAAYNNbAAAAASUExURQAAAE2J/wAAABZ32czY/xJws+JeaUsAAAABdFJOUwBA5thmAAAAGmZjVEwAAAAAAAAAgAAAAIAAAAAAAAAAAAAKAGQBAMxypfEAAACSSURBVHja7djLDkAwEEBRr///ZkLSiNGdTtBzVmIzN9EKHQYAAAAAAD5qCgQkjx6DtIzOA8roOSgZAnKmj3XtGgQcAZfpy+64uV0IaBdQm77dKQFNGwTEgPOjF5AfsAQCLEK7QIBF+PuA22VwCUj+Juw2oKbsRAE5P8i1N2Ha+UC3AU7J3hDgrPglAQAAAADwmBV7cw7OqjF4zgAAABpmY1RMAAAAAQAAACoAAAAwAAAAKwAAACUACgBkAQAsmbXXAAAAdmZkQVQAAAACeNrl1TsOACEIBFDdhftfeUlI8AN0MhY7hdHwCqJRW5vyuLQsBVQK3SXWBVTduybWBdRcTzI0ihKRLGUE0NAp1fnQEKq1W5TWGJUqhma9wug/d2C7CDPdXTH1gVHT/rSYOX5fT9Ow49iV0Uvf8QdsTQ2KNGZwXwAAABpmY1RMAAAAAwAAABgAAAAwAAAANAAAACUACgBkAQC9cx3cAAAAU2ZkQVQAAAAEeNrt1LEOABAMRdHS+v9f9kJCGSQ8k7ibnsFCRUrRJb5NwCG4up2CqpLQpsjMuhGA6XDNo1D7sAZvDNRIaA8e01Sa/8c+IB4uLZkM/tIJHIGitWQAAAAaZmNUTAAAAAUAAAAMAAAAMAAAADoAAAAiAAoAZAAAJFl9hwAAACVmZEFUAAAABnjaY2BCAgx4OYxgMMqBc5jBYEhzWMGAWhwiEhIADk0EycKak4gAAAAaZmNUTAAAAAcAAAAYAAAANAAAADQAAAAiAAoAZAAA6+/W4wAAAFdmZEFUAAAACHjaY2CgG2BCApRIADmMSAAhR5kEMzMz2RLIoqysrEAJqDUUSyBcTLHE4HEVMxhgsWPQSEBcPFwl4AzyJCAJHm46eo6iQAI9q5EoQaVCBgAfTQjdHAGdAgAAABpmY1RMAAAACQAAACoAAAAyAAAAKwAAACYACgBkAACsVWy8AAAAemZkQVQAAAAKeNrl1UsOgDAIBNBW4f5XlgSDKGOii8GFs2j6eQvSpu0Y9CwlndQWZgnWBBpuPQdoAs1uohy6kYqIDa1l0zvn1Pu77qJRZRv1qVjI6acvauXQH+6AX4RLuUHB3WLSmh7qWlXhaYH3lUCzfvTDEOhH3/EGZAUN0lDN6WoAAAAYdEVYdFNvZnR3YXJlAGdpZjJhcG5nLnNmLm5ldJb/E8gAAAAASUVORK5CYII=',
        },
        ticker: {
            signatures: [
                {
                    publicKey: 'dc61a7b0c950fcbd1bf55d9d43c4f8120cd261f5e55745e304649998889be1b8',
                    signature:
                        '93f015963238463866ad6a2b0064eebdf219e091419e6794269d828bc2faffc0e4bed5530396f569761a4e3823affaffe6725ee7e2aa1e686f02447c39962500',
                },
            ],
            sequenceNumber: 0,
            value: 'athom',
        },
        subject: '5acc52d5696e52345aec108468050d9d743eb21d6e41305bbc23a27b4154484f4d',
        decimals: {
            signatures: [
                {
                    publicKey: 'dc61a7b0c950fcbd1bf55d9d43c4f8120cd261f5e55745e304649998889be1b8',
                    signature:
                        '9e4a1a51b9d100daadc3135ef1b36fc049cf3db37db789b9566ec009bccf62ee2c96a51b45fcf5296747b4d4efc18ab0cb083a0c0585b562b811e7adea81ff01',
                },
            ],
            sequenceNumber: 0,
            value: 0,
        },
    })
    @Get('/metadata/{policyId}/{assetName}')
    public async getMetadata(@Path() policyId: string, @Path() assetName: string): Promise<TokenInfo> {
        return this.tokenRegistryService.getTokenMetadata(policyId, assetName);
    }

    /**
     * Implemented by `CARP` Service Provider
     * 
     * Gets the CIP25 metadata for given <policy, asset_name> pairs
     * 
     * Note: policy IDs and asset names MUST be in hex strings. Do not use UTF8 asset names.
     * 
     * Note: This endpoint returns the NFT metadata as a CBOR object and NOT JSON.
     * You may expect a JSON object, but actually Cardano has no concept of on-chain JSON.
     * In fact, on-chain JSON is not even possible!
     * Instead, Cardano stores metadata as CBOR which can then be converted to JSON
     * The conversion of CBOR to JSON is project-dependent, and so Carp instead returns the raw cbor
     * It's up to you to choose how you want to do the JSON conversion.
     * The common case is handled inside the Carp client library.
     * @param requestBody 
     * @returns CIP25 metadata for given <policy, asset_name> pairs
     */
    @Example<Cip25Response>({
        "cip25": {
          "b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f": {
            "42657272794e617679": "a365636f6c6f72672330303030383065696d616765783a697066733a2f2f697066732f516d534b593167317a5375506b3536635869324b38524e766961526b44485633505a756a7474663755676b343379646e616d656a4265727279204e617679"
          }
        }
      })
    @Post('/metadata/nft')
    public async getMetadataNft(@Body() requestBody: MetadataNftRequestBody): Promise<Cip25Response> {
        return this.carpService.getMetadataNft(requestBody.assets);
    }
}
