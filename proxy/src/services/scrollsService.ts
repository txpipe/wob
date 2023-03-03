import { ScrollsDataSource, ScrollsRedisDataSource } from '../dataSource/scrolls';
import { AdaHandle } from '../model/scrolls';
import { ProvideSingleton } from '../ioc';
import { inject } from 'inversify';

@ProvideSingleton(ScrollsService)
export class ScrollsService {
    constructor(@inject(ScrollsRedisDataSource) private dataSource: ScrollsDataSource) {}

    public async getAddressForHandle(handle: string): Promise<AdaHandle[]> {
        return this.dataSource.getAddressForHandle(handle);
    }

    public async getLatestBlock(): Promise<unknown> {
        //@TODO: Implement
        return;
    }
}
