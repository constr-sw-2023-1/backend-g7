class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, ApiError);
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg);
  }

  static internalError(msg) {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;