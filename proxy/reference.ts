import config from "config";

type Network = {
  nameID: string;
  carpURL: string;
  ogmiosURL: string;
  priceURL: string;
  tokenInfoURL: string;
  blockfrostURL: string;
  blockfrostAPIKey: string;
  scrollsURL: string;
  isTestnet: boolean;
};
export const networksList: Array<Network> = JSON.parse(config.get("networks"));
const testnetIDList: Array<string> = networksList
  .filter((network) => network.isTestnet)
  .map((network) => network.nameID);

console.log("Networks:", networksList);
console.log("Testnet IDs:", testnetIDList);

export const NetworkMap: Record<string, Network> = networksList.reduce(
  (acc, network) => {
    const { nameID } = network;
    return { ...acc, [nameID]: network };
  },
  {}
);

export const TestnetIDs = new Set(testnetIDList);

export enum AdaServices {
  OGMIOS = "ogmios",
  BLOCKFROST = "blockfrost",
  CARP = "carp",
  PRICEFEED = "pricefeed",
  TOKENINFO = "tokeninfo",
  SCROLLS = "scrolls",
  LATESTBLOCK = "latestblock",
}

export enum CommonServices {
  STATUS = "status",
  LATESTBLOCK = "latestblock",
}

const ServiceToConfigURLPropertyNameMap = {
  [AdaServices.CARP]: "carpURL",
  [AdaServices.OGMIOS]: "ogmiosURL",
  [AdaServices.SCROLLS]: "scrollsURL",
  [AdaServices.PRICEFEED]: "priceURL",
  [AdaServices.TOKENINFO]: "tokenInfoURL",
  [AdaServices.BLOCKFROST]: "blockfrostURL",
};

const CommonServiceMapping = {
  [CommonServices.STATUS]: CommonServices.STATUS,
  [CommonServices.LATESTBLOCK]: CommonServices.LATESTBLOCK,
};

const adaServicesList = Object.values(AdaServices);
const commonServicesList = Object.values(CommonServices);

// Adds ADA service proxy routes
export const ProxyRoutesRules = networksList.reduce((acc, network) => {
  const { nameID } = network;
  const accumulatorAddition = {};
  adaServicesList.forEach((service) => {
    if (service in ServiceToConfigURLPropertyNameMap) {
      accumulatorAddition[`/${nameID}/${service}`] =
        network[ServiceToConfigURLPropertyNameMap[service]];
    }
  });
  return { ...acc, ...accumulatorAddition };
}, {});

// Adds internal service proxy routes
networksList.forEach((network) => {
  const { nameID } = network;
  commonServicesList.forEach((service) => {
    ProxyRoutesRules[`/${nameID}/${service}`] = CommonServiceMapping[service];
  });
});

console.log("Proxy routes rules:", ProxyRoutesRules);

export const URLServiceNameMap = {};
networksList.forEach((network) => {
  [...adaServicesList, ...commonServicesList].forEach((service) => {
    const finalURL = network[ServiceToConfigURLPropertyNameMap[service]];
    if (finalURL && finalURL !== "") {
      URLServiceNameMap[network[ServiceToConfigURLPropertyNameMap[service]]] =
        service;
    } else {
      URLServiceNameMap[service] = service;
    }
  });
});

console.log("URL Service name map:", URLServiceNameMap);

export const AvailableCarpServices = {
  AddressUsed: "/address/used",
  BlockLatest: "/block/latest",
  MetadataNft: "/metadata/nft",
  TransactionHistory: "/transaction/history",
  TransactionOutput: "/transaction/output",
};

export const AvailableBlockfrostServices = {
  RewardsHistory: /accounts\/(.+)\/rewards/i,
  PoolInfo: /pools\/(.+)/,
  TransactionSubmit: /tx\/submit/,
};

export const AvailableOgmiosServices = {
  AccountState: "/account/state", // delegationAndRewards from Ogmios
  // TransactionStatus: "/transaction/status",
  //   TransactionSubmit: "transaction/submit", we'll use blockfrost instead for now
};

export const AvailablePriceFeedServices = {
  GetPrice: "/getprice",
  NftPrice: "/getnftprices",
  GetCardanoPools: "/getcardanopools",
};

export const AvailableTokenInfoServices = {
  GetTokenInfo: "/gettokeninfo",
  GetAssetMetadata: "/multiasset/metadata",
};

export const AvailableScrollsServices = {
  AddressForHandle: "/addressbyadahandle",
  LatestBlock: "/latestBlock",
};
