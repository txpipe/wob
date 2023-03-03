"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.TransactionController = void 0;
const tsoa_1 = require("tsoa");
const blockfrost_1 = require("../dataSource/blockfrost");
const carp_1 = require("../dataSource/carp");
const blockfrostService_1 = require("../services/blockfrostService");
const carpService_1 = require("../services/carpService");
let TransactionController = class TransactionController extends tsoa_1.Controller {
    // TODO: Inject services in constructor
    constructor() {
        super();
        this.carpService = new carpService_1.CarpService(new carp_1.CarpAPIDataSource(process.env.CARP_HOST));
        this.blockfrostService = new blockfrostService_1.BlockfrostService(new blockfrost_1.BlockfrostAPIDataSource(process.env.BLOCKFROST_API_KEY, process.env.BLOCKFROST_NETWORK));
    }
    getTransactionHistory(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.carpService.getTransactionHistory(requestBody.addresses, requestBody.after.tx, requestBody.after.block, requestBody.untilBlock, requestBody.limit, requestBody.relationFilter);
        });
    }
    getTransactionOutput(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.carpService.getTransactionOutput(requestBody.utxoPointers);
        });
    }
    transactionSubmit(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blockfrostService.postTransactionSubmit(requestBody.cbor);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)('/history'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionHistory", null);
__decorate([
    (0, tsoa_1.Post)('/output'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionOutput", null);
__decorate([
    (0, tsoa_1.Post)('/submit'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "transactionSubmit", null);
TransactionController = __decorate([
    (0, tsoa_1.Tags)('Transaction'),
    (0, tsoa_1.Route)('transaction'),
    __metadata("design:paramtypes", [])
], TransactionController);
exports.TransactionController = TransactionController;
