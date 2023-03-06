/**
 * @pattern [0-9a-fA-F]{64}
 * @example "8200581c8baf48931c5187cd59fde553f4e7da2e1a2aa9202ec6e67815cb3f8a"
 */
export type CredentialHex = string;
/**
 * @example "stake1ux236z4g4r4pztn5v69txyj2yq6a3esq5x4p4stxydra7zsnv25ue"
 * @example "addr1q9ya8v4pe33nlkgftyd70nhhp407pvnjjcsddhf64sh9gegwtvyxm7r69gx9cwvtg82p87zpwmzj0kj7tjmyraze3pzqe6zxzv"
 */
export type Bech32FullAddress = string;
/**
 * @example "script1ffv7hkf75573h0mlsg3jc7cpyuq2pn6tk7xc08dtkx3q5ah7h47"
 */
export type Bech32Credential = string;
/**
 * @example "Ae2tdPwUPEZHu3NZa6kCwet2msq4xrBXKHBDvogFKwMsF18Jca8JHLRBas7"
 * @example "DdzFFzCqrht3UrnL3bCK5QMi9XtmkqGG3G2tmuY17tWyhq63S7EzMpJPogoPKx15drcnJkH4A7QdqYgs4h3XD1zXb3zkDyBuAZcaqYDS"
 */
export type Base58Address = string;

/**
 * Supported types:
 * - Credential hex (8200581c...) - note this is not a keyhash (it contains a credential type prefix)
 * - Bech32 full address (`addr` / `addr_test` / `stake` / `stake_test`)
 * - Bech32 credentials ( `addr_vkh`, `script`, etc.) - this is the recommended approach
 * - Legacy Byron format (Ae2, Dd, etc.)
 *
 * Note: we recommend avoiding to query base addresses history using bech32
 * As Cardano UTXO spendability depends only on the payment credential and not the full base address
 * The result will also miss transactions that are only related to the payment key of the address
 * ex: the payment key is used in a multisig
 *
 * Note: using two different address representations in the same query will hurt performance (ex: addr1 and addr_vkh1)
 * This because under-the-hood this will run multiple independent SQL queries for the different formats
 *
 * Warning: querying reward bech32 addresses is equivalent to querying the stake credential inside it
 * This may return more results than expected (ex: a multisig containing the staking key of the wallet)
 *
 * @example "addr1qxzksn47upfu4fwqfmxx29rn5znlkw3ag98ul8rgndwm79aaql88xw6ez84k2ln6lawnt79sdqh7qwq0wcs672auktmsawshfe"
 */
export type Address = CredentialHex | Bech32FullAddress | Bech32Credential | Base58Address;

export type Credential = CredentialHex | Bech32Credential;
export type DisplayFormatAddress = Base58Address | Bech32FullAddress;

export interface Block {
    /**
     * @example 4924800
     */
    slot: number;
    /**
     * @example 209
     */
    epoch: number;
    /**
     * @example 4512067
     */
    height: number;
    /**
     * [0-9a-fA-F]{64}
     * @example "cf8c63a909d91776e27f7d05457e823a9dba606a7ab499ac435e7904ee70d7c8"
     */
    hash: string;
    /**
     * @example 1
     */
    era: number;
    isValid: boolean;
    indexInBlock: number;
}

export interface AddressAfter {
    tx: string;
    block: string;
}

/**
 * @pattern [0-9a-fA-F]{0,64}
 * @example "42657272794e617679"
 */
export type AssetName = string;

// export interface CIP25 {
//     /**
//  * @pattern [0-9a-fA-F]{56}
//  * @example "b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f"
//  */
//     policyId: string;
//     assets: { name: AssetName; metadata: string }[];
// }

export interface UtxoPointer {
    /**
     * @pattern [0-9a-fA-F]{64}
     * @example "011b86557367525891331b4bb985545120efc335b606d6a1c0d5a35fb330f421"
     */
    txHash: string;
    index: number;
}

export interface Transaction {
    /**
     * cbor-encoded transaction
     * @pattern [0-9a-fA-F]*
     * @example "84a500818258209cb4f8c2eecccc9f1e13768046f37ef56dcb5a4dc44f58907fe4ae21d7cf621d020181825839019cb581f4337a6142e477af6e00fe41b1fc4a5944a575681b8499a3c0bd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f71b0000000586321393021a0002a389031a004b418c048183028200581cbd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f7581c53215c471b7ac752e3ddf8f2c4c1e6ed111857bfaa675d5e31ce8bcea1008282582073e584cda9fe483fbefb81c251e616018a2b493ef56820f0095b63adede54ff758404f13df42ef1684a3fd55255d8368c9ecbd15b55e2761a2991cc4f401a753c16d6da1da158e84b87b4de9715af7d9adc0d79a7c1f2c3097228e02b20be4616a0c82582066c606974819f457ceface78ee3c4d181a84ca9927a3cfc92ef8c0b6dd4576e8584014ae9ee9ed5eb5700b6c5ac270543671f5d4f943d4726f4614dc061174ee29db44b9e7fc58e6c98c13fad8594f2633c5ec70a9a87f5cbf130308a42edb553001f5f6"
     */
    payload: string;
    /**
     * Strictly speaking, you can calculate this by hashing the payload
     * It's just provided for convenience
     * @pattern [0-9a-fA-F]{64}
     * @example "011b86557367525891331b4bb985545120efc335b606d6a1c0d5a35fb330f421"
     */
    hash: string;
}

export interface TransactionData {
    transaction: Transaction;
    block: Block;
}

export interface Utxo {
    index: number;
    txHash: string;
    /**
     * @pattern [0-9a-fA-F]*
     * @example "825839019cb581f4337a6142e477af6e00fe41b1fc4a5944a575681b8499a3c0bd07ce733b5911eb657e7aff5d35f8b0682fe0380f7621af2bbcb2f71b0000000586321393"
     */
    payload: string;
}

export interface UtxoData {
    utxo: Utxo;
    block: Block;
}

export enum PriceType {
    Buy = "buy",
    Sell = "sell",
    /**
     * Mean is not AVG from the last values, but the remaining amount of assets on the pool output
     */
    Mean = "mean",
};

export enum Direction {
    Buy = 'buy',
    Sell = 'sell',
  };
  
  export enum Dex {
    WingRiders = 'WingRiders',
    SundaeSwap = 'SundaeSwap',
    MinSwap = 'MinSwap',
  };
  
/**
 * @pattern [0-9a-fA-F]{56}
 * @example "b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f"
 */
export type PolicyId = string;

  export type Asset = {
    policyId: PolicyId;
    assetName: AssetName;
  } | null;
  
  /**
   * @pattern [1-9][0-9]*
   * @example "2042352568679"
   */
  export type Amount = string;

export type DexLastPrice = {
    asset1: Asset;
    asset2: Asset;
    amount1: Amount;
    amount2: Amount;
    dex: Dex;
};

export type DexMeanPrice = {
    tx_hash: string;
    dex: Dex;
    asset1: Asset;
    asset2: Asset;
    amount1: Amount;
    amount2: Amount;
}

export type DexSwap = {
    tx_hash: string;
    dex: Dex;
    asset1: Asset;
    asset2: Asset;
    amount1: Amount;
    amount2: Amount;
    direction: Direction;
}

type Cip25Metadata = string;

export type Cip25Response = {
    // https://github.com/lukeautry/tsoa/issues/1204#issuecomment-1133229741
    /**
     * @example { "b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f": { "42657272794e617679": "a365636f6c6f72672330303030383065696d616765783a697066733a2f2f697066732f516d534b593167317a5375506b3536635869324b38524e766961526b44485633505a756a7474663755676b343379646e616d656a4265727279204e617679" }}
     */
    cip25: { [policyId: string]: { [assetName: string]: Cip25Metadata } };
  };