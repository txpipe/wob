import { OgmiosClientDataSource, OgmiosDataSource } from "../dataSource/ogmios";

class OgmiosController {
  private dataSource: OgmiosDataSource;

  constructor(dataSource: OgmiosDataSource) {
    this.dataSource = dataSource;
  }

  public async getDelegationsAndRewards(
    stakeKeyHashes: string[]
  ): Promise<unknown> {
    return this.dataSource.getDelegationsAndRewards(stakeKeyHashes);
  }
}

export const ogmiosController = new OgmiosController(
  new OgmiosClientDataSource(
    process.env.OGMIOS_HOST!,
    Number(process.env.OGMIOS_PORT!)
  )
);
