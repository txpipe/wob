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
exports.CarpService = void 0;
class CarpService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getAddressUsed(addresses, afterTx, afterBlock, untilBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getAddressUsed(addresses, afterTx, afterBlock, untilBlock);
        });
    }
    getBlockLatest(offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getBlockLatest(offset);
        });
    }
    getMetadataNft(assets) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getMetadataNft(assets);
        });
    }
    getTransactionHistory(addresses, afterTx, afterBlock, untilBlock, limit, relationFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getTransactionHistory(addresses, afterTx, afterBlock, untilBlock, limit, relationFilter);
        });
    }
    getTransactionOutput(utxoPointers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getTransactionOutput(utxoPointers);
        });
    }
}
exports.CarpService = CarpService;
