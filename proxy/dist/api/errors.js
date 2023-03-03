"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.UnauthorizedError = exports.NotFoundError = void 0;
class ResponseError extends Error {
}
class NotFoundError extends ResponseError {
    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends ResponseError {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError extends ResponseError {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}
exports.BadRequestError = BadRequestError;
