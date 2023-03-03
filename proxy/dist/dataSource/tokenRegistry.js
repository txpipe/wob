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
exports.TokenRegistryAPIDataSource = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../api/errors");
class TokenRegistryAPIDataSource {
    constructor(host) {
        this.host = host;
    }
    getTokenMetadata(subject) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const requestConfig = {
                method: 'GET',
                url: `${this.host}/metadata/${subject}`,
            };
            try {
                const response = yield (0, axios_1.default)(requestConfig);
                const tokenInfo = Object.assign({}, response.data);
                return tokenInfo;
            }
            catch (err) {
                throw new errors_1.BadRequestError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || `unable to fetch token metadata for subject: ${subject}`);
            }
        });
    }
}
exports.TokenRegistryAPIDataSource = TokenRegistryAPIDataSource;
