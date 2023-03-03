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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockfrostService = void 0;
class BlockfrostService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getRewardsHistory(stakeAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getRewardsHistory(stakeAddress);
        });
    }
    getPoolInfo(poolId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getPoolInfo(poolId);
        });
    }
    getPools() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getPools();
        });
    }
    postTransactionSubmit(cbor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.postTransactionSubmit(cbor);
        });
    }
}
exports.BlockfrostService = BlockfrostService;
