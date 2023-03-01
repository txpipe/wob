import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestError } from '../api/errors';
import { TokenInfo } from '../model/tokenRegistry';

export interface TokenRegistryDataSource {
    getTokenMetadata(subject: string): Promise<TokenInfo>;
}

export class TokenRegistryAPIDataSource implements TokenRegistryDataSource {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    async getTokenMetadata(subject: string): Promise<TokenInfo> {
        const requestConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.host}/metadata/${subject}`,
        };

        try {
            const response = await axios(requestConfig);
            const tokenInfo: TokenInfo = {
                ...response.data
            }
            return tokenInfo;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to fetch token metadata for subject: ${subject}`);
        }
    }
}
