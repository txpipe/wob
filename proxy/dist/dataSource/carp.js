"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarpAPIDataSource = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../api/errors");
class CarpAPIDataSource {
    constructor(host) {
        this.host = host;
    }
    /**
    Ordered lexicographically (order is not maintained)
    Warning: the pagination on this endpoint is NOT whether or not an address was used during this block interval, but rather whether or not the address was first used within this interval.
    Note: this endpoint only returns addresses that are in a block.
   * @param addresses
   * @param afterTx
   * @param afterBlock
   * @param untilBlock
   * @returns
   */
    getAddressUsed(addresses, afterTx, afterBlock, untilBlock) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                addresses,
                after: {
                    tx: afterTx,
                    block: afterBlock,
                },
                untilBlock,
            };
            const requestConfig = {
                method: 'POST',
                url: `${this.host}/address/used`,
                data,
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.addresses) || [];
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || `unable to post address used`);
            }
        });
    }
    /**
     * Get the latest block. Useful for checking synchronization process and pagination
     * @param offset
     */
    getBlockLatest(offset) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                offset,
            };
            const requestConfig = {
                method: 'POST',
                url: `${this.host}/block/latest`,
                data,
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                if (response.data.block) {
                    const block = Object.assign({}, response.data.block);
                    return block;
                }
                return undefined;
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to post block latest`);
            }
        });
    }
    /**
     * Gets the CIP25 metadata for given <policy, asset_name> pairs
     * @param assets
     */
    getMetadataNft(assets) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const requestConfig = {
                method: 'POST',
                url: `${this.host}/metadata/nft`,
                data: assets,
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                if (response.data.cip25) {
                    return Object.entries(response.data.cip25).map(([policyId, assets]) => {
                        const cip25 = {
                            policyId,
                            assets: Object.entries(assets).map(([name, metadata]) => ({ name, metadata })),
                        };
                        return cip25;
                    });
                }
                return [];
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to post metadata nft`);
            }
        });
    }
    /**
     * Ordered by <block.height, transaction.tx_index>
       Note: this endpoint only returns txs that are in a block. Use another tool to see mempool for txs not in a block
     * @param addresses
     * @param afterTx
     * @param afterBlock
     * @param untilBlock
     * @param limit
     * @param relationFilter
     * @returns
     */
    getTransactionHistory(addresses, afterTx, afterBlock, untilBlock, limit, relationFilter) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                addresses,
                after: {
                    tx: afterTx,
                    block: afterBlock,
                },
                untilBlock,
                limit,
                relationFilter,
            };
            const requestConfig = {
                method: 'POST',
                url: `${this.host}/transaction/history`,
                data,
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                if (response.data.transactions) {
                    return response.data.transactions.map((t) => t);
                }
                return [];
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to post transaction history`);
            }
        });
    }
    /**
     * Get the outputs for given <tx hash, output index> pairs.
     * @param utxoPointers
     * @returns
     */
    getTransactionOutput(utxoPointers) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                utxoPointers,
            };
            const requestConfig = {
                method: 'POST',
                url: `${this.host}/transaction/output`,
                data,
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                if (response.data.utxos) {
                    return response.data.utxos.map((t) => t);
                }
                return [];
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to post transaction output`);
            }
        });
    }
}
exports.CarpAPIDataSource = CarpAPIDataSource;
