class ApiError extends Error {
  public statusCode: number;
  public path: string;

  constructor(
    statusCode: number,
    message: string,
    path = "global",
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.message = message;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
