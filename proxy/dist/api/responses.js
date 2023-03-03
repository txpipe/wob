"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseServerError = exports.responseNotFound = exports.responseUnauthorized = exports.responseBadRequest = exports.responseOk = void 0;
var Status;
(function (Status) {
    Status[Status["OK"] = 200] = "OK";
    Status[Status["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    Status[Status["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Status[Status["NOT_FOUND"] = 404] = "NOT_FOUND";
    Status[Status["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(Status || (Status = {}));
function statusMessage(status) {
    switch (status) {
        case Status.BAD_REQUEST:
            return "Bad Request";
        case Status.UNAUTHORIZED:
            return "Unauthorized";
        case Status.NOT_FOUND:
            return "Not Found";
        case Status.SERVER_ERROR:
            return "Internal Server Error";
    }
}
function jsonResponse(res, body, options = {}) {
    options.status || (options.status = Status.OK);
    return res.status(options.status).json(body);
}
/**
 * Response Ok
 * @param res
 * @param data
 * @returns
 */
const responseOk = (res, data) => jsonResponse(res, data);
exports.responseOk = responseOk;
/**
 * Response bad request
 * @param res
 * @param errors
 */
const responseBadRequest = (res, errors) => {
    Array.isArray(errors) || (errors = [errors]);
    const status = Status.BAD_REQUEST;
    const body = {
        statusCode: status,
        message: statusMessage(status),
        errors: errors,
    };
    jsonResponse(res, body, { status: status });
};
exports.responseBadRequest = responseBadRequest;
/**
 * Response unauthorized
 * @param res
 * @param message
 */
const responseUnauthorized = (res, message) => {
    const status = Status.UNAUTHORIZED;
    const body = {
        statusCode: status,
        message: message || statusMessage(status),
    };
    jsonResponse(res, body, { status: status });
};
exports.responseUnauthorized = responseUnauthorized;
/**
 * Response not found
 * @param res
 * @param message
 */
const responseNotFound = (res, message) => {
    const status = Status.NOT_FOUND;
    const body = {
        statusCode: status,
        message: message || statusMessage(status),
    };
    jsonResponse(res, body, { status: status });
};
exports.responseNotFound = responseNotFound;
/**
 * Response server error
 * @param res
 * @param error
 */
const responseServerError = (res, error) => {
    const status = Status.SERVER_ERROR;
    const body = {
        statusCode: status,
        message: statusMessage(status),
        error: error,
    };
    jsonResponse(res, body, { status: status });
};
exports.responseServerError = responseServerError;
