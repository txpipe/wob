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
exports.OgmiosClientDataSource = void 0;
const client_1 = require("@cardano-ogmios/client");
class OgmiosClientDataSource {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    getDelegationsAndRewards(stakeKeyHashes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            if (!this.client)
                return {};
            return yield this.client.delegationsAndRewards(stakeKeyHashes);
        });
    }
    /**
     * Connects the client and returns an initialized context if not connected
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // Lazy initialization of ogmios client
            if (this.client)
                return this.client;
            // @TODO: Handle error state better
            const context = yield (0, client_1.createInteractionContext)(err => console.error(err), () => console.log('Connection closed.'), { connection: { host: this.host, port: this.port, tls: true } });
            this.client = yield (0, client_1.createStateQueryClient)(context);
        });
    }
}
exports.OgmiosClientDataSource = OgmiosClientDataSource;
