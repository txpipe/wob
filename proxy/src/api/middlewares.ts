import { ErrorRequestHandler, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { NotFoundError } from "./errors";
import { responseBadRequest, responseNotFound, responseServerError, responseUnauthorized } from "./responses";

/**
 * Handles the different type of errors
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  
  // Handle express-validation errors
  if (Array.isArray(err)) {
    return responseBadRequest(res, err);
  }

  // Custom error types
  switch (err.name) {
    case 'Unauthorized':
      return responseUnauthorized(res, err.message);
    case 'NotFound':
      return responseNotFound(res, err.message);
    case 'BadRequest':
      return responseBadRequest(res, err.message);
  }

  // Defaults to server error
  responseServerError(res, err);
};

/**
 * Middleware definition for implementing express-validator
 * @param req 
 * @param res 
 * @param next 
 */
export const checkValidationHandler: RequestHandler = (req, res, next): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((item): any => {
      const err = item as { msg: string };
      return { message: err.msg };
    });
    if (next) next(errorMessages);
  }
  if (next) next();
};

/**
 * Middleware default for unknown routes
 * @param req 
 * @param res 
 * @param next 
 */
export const notFoundHandler: RequestHandler = (req, res, next): void => {
  const err = new NotFoundError('Not Found');
  err.statusCode = 404;
  if (next) next(err);
};
