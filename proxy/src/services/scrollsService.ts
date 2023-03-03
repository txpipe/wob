import { ScrollsDataSource } from '../dataSource/scrolls';
import { AdaHandle } from '../model/scrolls';

export class ScrollsService {
    private dataSource: ScrollsDataSource;

    constructor(dataSource: ScrollsDataSource) {
        this.dataSource = dataSource;
    }

    public async getAddressForHandle(handle: string): Promise<AdaHandle[]> {
        return this.dataSource.getAddressForHandle(handle);
    }

    public async getLatestBlock(): Promise<unknown> {
        //@TODO: Implement
        return;
    }
}