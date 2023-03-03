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
exports.AssetsController = void 0;
const tsoa_1 = require("tsoa");
const carp_1 = require("../dataSource/carp");
const tokenRegistry_1 = require("../dataSource/tokenRegistry");
const carpService_1 = require("../services/carpService");
const tokenRegistryService_1 = require("../services/tokenRegistryService");
let AssetsController = class AssetsController extends tsoa_1.Controller {
    // TODO: Inject services in constructor
    constructor() {
        super();
        this.carpService = new carpService_1.CarpService(new carp_1.CarpAPIDataSource(process.env.CARP_HOST));
        this.tokenRegistryService = new tokenRegistryService_1.TokenRegistryService(new tokenRegistry_1.TokenRegistryAPIDataSource(process.env.TOKEN_REGISTRY_URL));
    }
    getMetadata(policyId, assetName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tokenRegistryService.getTokenMetadata(policyId, assetName);
        });
    }
    getMetadataNft(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.carpService.getMetadataNft(requestBody.assets);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('/metadata/{policyId}/{assetName}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getMetadata", null);
__decorate([
    (0, tsoa_1.Post)('/metadata/nft'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getMetadataNft", null);
AssetsController = __decorate([
    (0, tsoa_1.Tags)('Assets'),
    (0, tsoa_1.Route)('assets'),
    __metadata("design:paramtypes", [])
], AssetsController);
exports.AssetsController = AssetsController;
