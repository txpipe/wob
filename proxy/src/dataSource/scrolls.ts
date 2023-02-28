import * as redis from "redis";
import { RedisClientType } from "@redis/client";
import { AdaHandle } from "../model/scrolls";


export interface ScrollsDataSource {
  getAddressForHandle(handle: string): Promise<AdaHandle[]>;
  getLatestBlock(): Promise<unknown>;
}

export class ScrollsRedisDataSource implements ScrollsDataSource {
  private client: RedisClientType;

  constructor(url: string) {
     this.client = redis.createClient({
      url,
    });    
  }

  async getAddressForHandle(handle: string): Promise<AdaHandle[]> {
    if (!this.client.isReady) {
      await this.client.connect();
    }
  
    const keys = (await this.client.sendCommand(["keys", `c.${handle}*`])) as string[];
  
    if (!keys) return [];
  
    const values = await this.client.mGet(keys);
  
    let index = 0;
  
    const result = keys.map((k) => {
      const item: AdaHandle = {
        key: k.split("c.")[1],
        value: values[index] || "",
      };
      index += 1;
      return item;
    });
  
    return result;  }

  getLatestBlock(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  
}
