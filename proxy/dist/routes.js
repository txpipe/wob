"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const accountController_1 = require("./controllers/accountController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const addressController_1 = require("./controllers/addressController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const assetsController_1 = require("./controllers/assetsController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const blockController_1 = require("./controllers/blockController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const poolController_1 = require("./controllers/poolController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const transactionController_1 = require("./controllers/transactionController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "DelegationAndRewards": {
        "dataType": "refObject",
        "properties": {
            "delegate": { "dataType": "string" },
            "rewards": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AccountDelegationAndRewardsRequestBody": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "stakeKeyHashes": { "dataType": "array", "array": { "dataType": "string" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdaHandle": {
        "dataType": "refObject",
        "properties": {
            "key": { "dataType": "string", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Reward": {
        "dataType": "refObject",
        "properties": {
            "epoch": { "dataType": "double", "required": true },
            "amount": { "dataType": "string", "required": true },
            "pool_id": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddressAfter": {
        "dataType": "refObject",
        "properties": {
            "tx": { "dataType": "string", "required": true },
            "block": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddressUsedRequestBody": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "untilBlock": { "dataType": "string", "required": true }, "after": { "ref": "AddressAfter", "required": true }, "addresses": { "dataType": "array", "array": { "dataType": "string" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Signature": {
        "dataType": "refObject",
        "properties": {
            "publicKey": { "dataType": "string", "required": true },
            "signature": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Name": {
        "dataType": "refObject",
        "properties": {
            "signatures": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Signature" }, "required": true },
            "sequenceNumber": { "dataType": "double", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Url": {
        "dataType": "refObject",
        "properties": {
            "signatures": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Signature" }, "required": true },
            "sequenceNumber": { "dataType": "double", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Description": {
        "dataType": "refObject",
        "properties": {
            "signatures": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Signature" }, "required": true },
            "sequenceNumber": { "dataType": "double", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Logo": {
        "dataType": "refObject",
        "properties": {
            "signatures": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Signature" }, "required": true },
            "sequenceNumber": { "dataType": "double", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Ticker": {
        "dataType": "refObject",
        "properties": {
            "signatures": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Signature" }, "required": true },
            "sequenceNumber": { "dataType": "double", "required": true },
            "value": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Decimals": {
        "dataType": "refObject",
        "properties": {
            "signatures": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Signature" }, "required": true },
            "sequenceNumber": { "dataType": "double", "required": true },
            "value": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenInfo": {
        "dataType": "refObject",
        "properties": {
            "name": { "ref": "Name", "required": true },
            "url": { "ref": "Url", "required": true },
            "description": { "ref": "Description", "required": true },
            "logo": { "ref": "Logo", "required": true },
            "ticker": { "ref": "Ticker", "required": true },
            "subject": { "dataType": "string", "required": true },
            "decimals": { "ref": "Decimals", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CIP25": {
        "dataType": "refObject",
        "properties": {
            "policyId": { "dataType": "string", "required": true },
            "assets": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "metadata": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssetName": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetadataNftRequestBody": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "assets": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "AssetName" } }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Block": {
        "dataType": "refObject",
        "properties": {
            "slot": { "dataType": "double", "required": true },
            "epoch": { "dataType": "double", "required": true },
            "height": { "dataType": "double", "required": true },
            "hash": { "dataType": "string", "required": true },
            "era": { "dataType": "double", "required": true },
            "isValid": { "dataType": "boolean", "required": true },
            "indexInBlock": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pool": {
        "dataType": "refObject",
        "properties": {
            "pool_id": { "dataType": "string", "required": true },
            "hex": { "dataType": "string", "required": true },
            "vrf_key": { "dataType": "string", "required": true },
            "blocks_minted": { "dataType": "double", "required": true },
            "blocks_epoch": { "dataType": "double", "required": true },
            "live_stake": { "dataType": "string", "required": true },
            "live_size": { "dataType": "double", "required": true },
            "live_saturation": { "dataType": "double", "required": true },
            "live_delegators": { "dataType": "double", "required": true },
            "active_stake": { "dataType": "string", "required": true },
            "active_size": { "dataType": "double", "required": true },
            "declared_pledge": { "dataType": "string", "required": true },
            "live_pledge": { "dataType": "string", "required": true },
            "margin_cost": { "dataType": "double", "required": true },
            "fixed_cost": { "dataType": "string", "required": true },
            "reward_account": { "dataType": "string", "required": true },
            "owners": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "registration": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "retirement": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Transaction": {
        "dataType": "refObject",
        "properties": {
            "payload": { "dataType": "string", "required": true },
            "hash": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionData": {
        "dataType": "refObject",
        "properties": {
            "transaction": { "ref": "Transaction", "required": true },
            "block": { "ref": "Block", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionHistoryRequestBody": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "relationFilter": { "dataType": "double" }, "limit": { "dataType": "double" }, "untilBlock": { "dataType": "string", "required": true }, "after": { "ref": "AddressAfter", "required": true }, "addresses": { "dataType": "array", "array": { "dataType": "string" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Utxo": {
        "dataType": "refObject",
        "properties": {
            "index": { "dataType": "double", "required": true },
            "txHash": { "dataType": "string", "required": true },
            "payload": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UtxoData": {
        "dataType": "refObject",
        "properties": {
            "utxo": { "ref": "Utxo", "required": true },
            "block": { "ref": "Block", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UtxoPointers": {
        "dataType": "refObject",
        "properties": {
            "index": { "dataType": "double", "required": true },
            "txHash": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionOutputRequestBody": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "utxoPointers": { "dataType": "array", "array": { "dataType": "refObject", "ref": "UtxoPointers" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionSubmitRequestBody": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "cbor": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/account/state', ...((0, runtime_1.fetchMiddlewares)(accountController_1.AccountController)), ...((0, runtime_1.fetchMiddlewares)(accountController_1.AccountController.prototype.getDelegationAndRewards)), function AccountController_getDelegationAndRewards(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "AccountDelegationAndRewardsRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new accountController_1.AccountController();
            const promise = controller.getDelegationAndRewards.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/address/handle/:handle', ...((0, runtime_1.fetchMiddlewares)(addressController_1.AddressController)), ...((0, runtime_1.fetchMiddlewares)(addressController_1.AddressController.prototype.getAddressForHandler)), function AddressController_getAddressForHandler(request, response, next) {
        const args = {
            handle: { "in": "path", "name": "handle", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new addressController_1.AddressController();
            const promise = controller.getAddressForHandler.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/address/rewards/:stakeAddress', ...((0, runtime_1.fetchMiddlewares)(addressController_1.AddressController)), ...((0, runtime_1.fetchMiddlewares)(addressController_1.AddressController.prototype.getRewards)), function AddressController_getRewards(request, response, next) {
        const args = {
            stakeAddress: { "in": "path", "name": "stakeAddress", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new addressController_1.AddressController();
            const promise = controller.getRewards.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/address/used', ...((0, runtime_1.fetchMiddlewares)(addressController_1.AddressController)), ...((0, runtime_1.fetchMiddlewares)(addressController_1.AddressController.prototype.getAddressUsed)), function AddressController_getAddressUsed(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "AddressUsedRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new addressController_1.AddressController();
            const promise = controller.getAddressUsed.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/assets/metadata/:policyId/:assetName', ...((0, runtime_1.fetchMiddlewares)(assetsController_1.AssetsController)), ...((0, runtime_1.fetchMiddlewares)(assetsController_1.AssetsController.prototype.getMetadata)), function AssetsController_getMetadata(request, response, next) {
        const args = {
            policyId: { "in": "path", "name": "policyId", "required": true, "dataType": "string" },
            assetName: { "in": "path", "name": "assetName", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new assetsController_1.AssetsController();
            const promise = controller.getMetadata.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/assets/metadata/nft', ...((0, runtime_1.fetchMiddlewares)(assetsController_1.AssetsController)), ...((0, runtime_1.fetchMiddlewares)(assetsController_1.AssetsController.prototype.getMetadataNft)), function AssetsController_getMetadataNft(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "MetadataNftRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new assetsController_1.AssetsController();
            const promise = controller.getMetadataNft.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/block/latest', ...((0, runtime_1.fetchMiddlewares)(blockController_1.BlockController)), ...((0, runtime_1.fetchMiddlewares)(blockController_1.BlockController.prototype.getLatest)), function BlockController_getLatest(request, response, next) {
        const args = {
            offset: { "in": "query", "name": "offset", "required": true, "dataType": "double" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new blockController_1.BlockController();
            const promise = controller.getLatest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/pool/:poolId', ...((0, runtime_1.fetchMiddlewares)(poolController_1.PoolController)), ...((0, runtime_1.fetchMiddlewares)(poolController_1.PoolController.prototype.getPoolInfo)), function PoolController_getPoolInfo(request, response, next) {
        const args = {
            poolId: { "in": "path", "name": "poolId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new poolController_1.PoolController();
            const promise = controller.getPoolInfo.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/pool', ...((0, runtime_1.fetchMiddlewares)(poolController_1.PoolController)), ...((0, runtime_1.fetchMiddlewares)(poolController_1.PoolController.prototype.getPools)), function PoolController_getPools(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new poolController_1.PoolController();
            const promise = controller.getPools.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/transaction/history', ...((0, runtime_1.fetchMiddlewares)(transactionController_1.TransactionController)), ...((0, runtime_1.fetchMiddlewares)(transactionController_1.TransactionController.prototype.getTransactionHistory)), function TransactionController_getTransactionHistory(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "TransactionHistoryRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactionController_1.TransactionController();
            const promise = controller.getTransactionHistory.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/transaction/output', ...((0, runtime_1.fetchMiddlewares)(transactionController_1.TransactionController)), ...((0, runtime_1.fetchMiddlewares)(transactionController_1.TransactionController.prototype.getTransactionOutput)), function TransactionController_getTransactionOutput(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "TransactionOutputRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactionController_1.TransactionController();
            const promise = controller.getTransactionOutput.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/transaction/submit', ...((0, runtime_1.fetchMiddlewares)(transactionController_1.TransactionController)), ...((0, runtime_1.fetchMiddlewares)(transactionController_1.TransactionController.prototype.transactionSubmit)), function TransactionController_transactionSubmit(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "TransactionSubmitRequestBody" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new transactionController_1.TransactionController();
            const promise = controller.transactionSubmit.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200);
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
