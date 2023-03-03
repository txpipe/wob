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
exports.AddressController = void 0;
const tsoa_1 = require("tsoa");
const blockfrost_1 = require("../dataSource/blockfrost");
const carp_1 = require("../dataSource/carp");
const scrolls_1 = require("../dataSource/scrolls");
const blockfrostService_1 = require("../services/blockfrostService");
const carpService_1 = require("../services/carpService");
const scrollsService_1 = require("../services/scrollsService");
let AddressController = class AddressController extends tsoa_1.Controller {
    // TODO: Inject services in constructor
    constructor() {
        super();
        this.scrollsService = new scrollsService_1.ScrollsService(new scrolls_1.ScrollsRedisDataSource(process.env.SCROLLS_URL));
        this.carpService = new carpService_1.CarpService(new carp_1.CarpAPIDataSource(process.env.CARP_HOST));
        this.blockfrostService = new blockfrostService_1.BlockfrostService(new blockfrost_1.BlockfrostAPIDataSource(process.env.BLOCKFROST_API_KEY, process.env.BLOCKFROST_NETWORK));
    }
    getAddressForHandler(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scrollsService.getAddressForHandle(handle);
        });
    }
    getRewards(stakeAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blockfrostService.getRewardsHistory(stakeAddress);
        });
    }
    getAddressUsed(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.carpService.getAddressUsed(requestBody.addresses, requestBody.after.tx, requestBody.after.block, requestBody.untilBlock);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/handle/{handle}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "getAddressForHandler", null);
__decorate([
    (0, tsoa_1.Get)('/rewards/{stakeAddress}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "getRewards", null);
__decorate([
    (0, tsoa_1.Post)('/used'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "getAddressUsed", null);
AddressController = __decorate([
    (0, tsoa_1.Tags)('Address'),
    (0, tsoa_1.Route)('address'),
    __metadata("design:paramtypes", [])
], AddressController);
exports.AddressController = AddressController;
