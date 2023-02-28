export interface Block {
    slot: number;
    epoch: number;
    height: number;
    hash: string;
    era: number;
    isValid: boolean;
    indexInBlock: number;
}

export interface Asset {
    policyId: string;
    assetNames: string[];
}

export interface CIP25 {
    policyId: string;
    metadata: { [assetName: string]: string };
}

export interface UtxoPointers {
  index: number;
  txHash: string;
}