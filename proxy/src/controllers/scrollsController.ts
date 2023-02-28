import { ScrollsDataSource, ScrollsRedisDataSource } from "../dataSource/scrolls";
import { AdaHandle } from "../model/scrolls";

class ScrollsController {
  
  private dataSource: ScrollsDataSource; 

  constructor (dataSource: ScrollsDataSource) {
    this.dataSource = dataSource;
  }

  public async getAddressForHandle(handle: string): Promise<AdaHandle[]> {
    return this.dataSource.getAddressForHandle(handle);
  }

  public async getLatestBlock(): Promise<unknown>{
    //@TODO: Implement
    return;
  }

}

export const scrollsController = new ScrollsController(new ScrollsRedisDataSource(process.env.SCROLLS_URL!));