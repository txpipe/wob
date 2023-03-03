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
exports.BlockfrostAPIDataSource = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../api/errors");
/**
 * Returns the blockfrost base URL given the network we are connecting to
 * @TODO check if this is required or if we just set the URL as part of the container envs
 * @param network
 * @returns
 */
function getBaseUrl(network) {
    switch (network) {
        case 'cardano-mainnet':
            return 'https://cardano-mainnet.blockfrost.io/api/v0';
        case 'cardano-preprod':
            return 'https://cardano-preprod.blockfrost.io/api/v0';
        case 'cardano-preview':
            return 'https://cardano-preview.blockfrost.io/api/v0';
    }
}
class BlockfrostAPIDataSource {
    constructor(apiKey, network) {
        this.apiKey = apiKey;
        this.network = network;
    }
    getRewardsHistory(stakeAddress) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // @TODO: Add pagination query params
            const requestConfig = {
                method: 'GET',
                url: `${getBaseUrl(this.network)}/accounts/${stakeAddress}/rewards`,
                headers: { project_id: this.apiKey },
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                return response.data.map((r) => {
                    return r;
                });
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to fetch rewards history for stake address: ${stakeAddress}`);
            }
        });
    }
    getPoolInfo(poolId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const requestConfig = {
                method: 'GET',
                url: `${getBaseUrl(this.network)}/pools/${poolId}`,
                headers: { project_id: this.apiKey },
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                const pool = Object.assign({}, response.data);
                return pool;
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to fetch information for pool with id: ${poolId}`);
            }
        });
    }
    getPools() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const requestConfig = {
                method: 'GET',
                url: `${getBaseUrl(this.network)}/pools/`,
                headers: { project_id: this.apiKey },
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                return response.data;
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to fetch pools`);
            }
        });
    }
    postTransactionSubmit(cbor) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const requestConfig = {
                method: 'POST',
                url: `${getBaseUrl(this.network)}/tx/submit`,
                headers: { project_id: this.apiKey, 'Content-Type': 'application/cbor' },
                data: JSON.stringify(cbor),
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                // Returns the id of the submitted transaction
                return response.data;
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to post transaction with cbor: ${cbor}`);
            }
        });
    }
}
exports.BlockfrostAPIDataSource = BlockfrostAPIDataSource;
