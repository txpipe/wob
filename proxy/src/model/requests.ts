import { Address, AddressAfter, AssetName, UtxoPointer } from './carp';

export type AccountDelegationAndRewardsRequestBody = {
    stakeKeyHashes: string[];
};

export type AddressUsedRequestBody = {
    addresses: Address[];
    after: AddressAfter;
    untilBlock: string;
};

export type MetadataNftRequestBody = {
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
