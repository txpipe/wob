class ResponseError extends Error {
    public statusCode?: number;
  }
  
  export class NotFoundError extends ResponseError {
    public constructor(message: string) {
      super(message);
      this.name = 'NotFound';
    }
  }
  
  export class UnauthorizedError extends ResponseError {
    public constructor(message: string) {
      super(message);
      this.name = 'Unauthorized';
    }
  }
  
  export class BadRequestError extends ResponseError {
    public constructor(message: string) {
      super(message);
      this.name = 'BadRequest';
    }
  }