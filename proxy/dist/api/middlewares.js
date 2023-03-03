"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.checkValidationHandler = exports.errorHandler = void 0;
const express_validator_1 = require("express-validator");
const errors_1 = require("./errors");
const responses_1 = require("./responses");
/**
 * Handles the different type of errors
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
const errorHandler = (err, req, res, next) => {
    // Handle express-validation errors
    if (Array.isArray(err)) {
        return (0, responses_1.responseBadRequest)(res, err);
    }
    // Custom error types
    switch (err.name) {
        case 'Unauthorized':
            return (0, responses_1.responseUnauthorized)(res, err.message);
        case 'NotFound':
            return (0, responses_1.responseNotFound)(res, err.message);
        case 'BadRequest':
            return (0, responses_1.responseBadRequest)(res, err.message);
    }
    // Defaults to server error
    (0, responses_1.responseServerError)(res, err);
};
exports.errorHandler = errorHandler;
/**
 * Middleware definition for implementing express-validator
 * @param req
 * @param res
 * @param next
 */
const checkValidationHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((item) => {
            const err = item;
            return { message: err.msg };
        });
        if (next)
            next(errorMessages);
    }
    if (next)
        next();
};
exports.checkValidationHandler = checkValidationHandler;
/**
 * Middleware default for unknown routes
 * @param req
 * @param res
 * @param next
 */
const notFoundHandler = (req, res, next) => {
    const err = new errors_1.NotFoundError('Not Found');
    err.statusCode = 404;
    if (next)
        next(err);
};
exports.notFoundHandler = notFoundHandler;
