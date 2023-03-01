import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestError } from '../api/errors';

export interface TokenRegistryDataSource {
    getTokenMetadata(subject: string): Promise<unknown>;
}

export class TokenRegistryAPIDataSource implements TokenRegistryDataSource {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    async getTokenMetadata(subject: string): Promise<unknown> {
        const requestConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `${this.host}/metadata/${subject}`,
        };

        try {
            const response = await axios(requestConfig);
            return;
        } catch (err: any) {
            throw new BadRequestError(err.response?.data?.message || `unable to fetch token metadata for subject: ${subject}`);
        }
    }
}
