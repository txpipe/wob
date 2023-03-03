export interface Block {
    slot: number;
    epoch: number;
    height: number;
    hash: string;
    era: number;
    isValid: boolean;
    indexInBlock: number;
}

export interface AddressAfter {
    tx: string;
    block: string;
}

export type AssetName = string;

export interface CIP25 {
    policyId: string;
    assets: { name: string; metadata: string }[];
}

export interface UtxoPointers {
    index: number;
    txHash: string;
}

export interface Transaction {
    payload: string;
    hash: string;
}

export interface TransactionData {
    transaction: Transaction;
    block: Block;
}

export interface Utxo {
    index: number;
    txHash: string;
    payload: string;
}

export interface UtxoData {
    utxo: Utxo;
    block: Block;
}
