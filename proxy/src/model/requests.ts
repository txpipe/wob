import { Address, AddressAfter, Asset, AssetName, Dex, PriceType, UtxoPointer } from './carp';

export type AccountDelegationAndRewardsRequestBody = {
    stakeKeyHashes: string[];
};

export type AddressUsedRequestBody = {
    addresses: Address[];
    after: AddressAfter;
    untilBlock: string;
};

export type MetadataNftRequestBody = {
    /**
     * @example { "b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f": ["42657272794e617679"] }
     */
    assets: { [policyId: string]: AssetName[] };
};

export type TransactionOutputRequestBody = {
    utxoPointers: UtxoPointer[];
};

export type TransactionSubmitRequestBody = {
    cbor: string;
};

export type TransactionHistoryRequestBody = {
    addresses: Address[];
    after: AddressAfter;
    untilBlock: string;
    limit?: number;
    relationFilter?: number;
};

export type DexLastPriceRequestBody = {
    assetPairs: { asset1: Asset; asset2: Asset }[];
    type: PriceType;
};

export type DexMeanPriceRequestBody = {
    assetPairs: { asset1: Asset; asset2: Asset }[];
    dexes: Array<Dex>;
    /** Defaults to `DEX_PRICE_LIMIT.RESPONSE` */
    limit?: number;
};

export type DexSwapPriceRequestBody = {
    dexes: Array<Dex>;
    assetPairs: { asset1: Asset; asset2: Asset }[];
    /** Defaults to `DEX_PRICE_LIMIT.RESPONSE` */
    limit?: number;
};
