import { AddressAfter, AssetName, UtxoPointers } from './carp';

export type AccountDelegationAndRewardsRequestBody = {
    stakeKeyHashes: string[];
};

export type AddressUsedRequestBody = {
    addresses: string[];
    after: AddressAfter;
    untilBlock: string;
};

export type MetadataNftRequestBody = {
    assets: { [policyId: string]: AssetName[] };
};

export type TransactionOutputRequestBody = {
    utxoPointers: UtxoPointers[];
};

export type TransactionSubmitRequestBody = {
    cbor: string;
};

export type TransactionHistoryRequestBody = {
    addresses: string[];
    after: AddressAfter;
    untilBlock: string;
    limit?: number;
    relationFilter?: number;
};
