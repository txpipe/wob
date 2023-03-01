export interface Signature {
    publicKey: string;
    signature: string;
}

export interface Name {
    signatures: Signature[];
    sequenceNumber: number;
    value: string;
}

export interface Url {
    signatures: Signature[];
    sequenceNumber: number;
    value: string;
}

export interface Description {
    signatures: Signature[];
    sequenceNumber: number;
    value: string;
}

export interface Logo {
    signatures: Signature[];
    sequenceNumber: number;
    value: string;
}

export interface Ticker {
    signatures: Signature[];
    sequenceNumber: number;
    value: string;
}

export interface Decimals {
    signatures: Signature[];
    sequenceNumber: number;
    value: number;
}

export interface TokenInfo {
    name: Name;
    url: Url;
    description: Description;
    logo: Logo;
    ticker: Ticker;
    subject: string;
    decimals: Decimals;
}
