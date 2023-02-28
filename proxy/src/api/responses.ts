import { Response } from "express";
export { Response };

enum Status {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

function statusMessage(status: Status): string | undefined {
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

function jsonResponse<T>(
  res: Response<T>,
  body: T,
  options: any = {}
): Response<T> {
  options.status || (options.status = Status.OK);
  return res.status(options.status).json(body);
}

/**
 * Response Ok
 * @param res 
 * @param data 
 * @returns 
 */
export const responseOk = <T>(res: Response<T>, data: any): Response<T> =>
  jsonResponse<T>(res, data);

/**
 * Response bad request
 * @param res 
 * @param errors 
 */
export const responseBadRequest = (res: Response, errors: any): void => {
  Array.isArray(errors) || (errors = [errors]);

  const status = Status.BAD_REQUEST;

  const body = {
    statusCode: status,
    message: statusMessage(status),
    errors: errors,
  };

  jsonResponse(res, body, { status: status });
};

/**
 * Response unauthorized
 * @param res 
 * @param message 
 */
export const responseUnauthorized = (res: Response, message?: string): void => {
  const status = Status.UNAUTHORIZED;

  const body = {
    statusCode: status,
    message: message || statusMessage(status),
  };

  jsonResponse(res, body, { status: status });
};

/**
 * Response not found
 * @param res 
 * @param message 
 */
export const responseNotFound = (res: Response, message: string): void => {
  const status = Status.NOT_FOUND;
  const body = {
    statusCode: status,
    message: message || statusMessage(status),
  };

  jsonResponse(res, body, { status: status });
};

/**
 * Response server error
 * @param res 
 * @param error 
 */
export const responseServerError = (res: Response, error: any): void => {
  const status = Status.SERVER_ERROR;

  const body = {
    statusCode: status,
    message: statusMessage(status),
    error: error,
  };
  jsonResponse(res, body, { status: status });
};
