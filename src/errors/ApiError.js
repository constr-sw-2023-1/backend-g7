class ApiError extends Error {
  constructor(message, statusCode){
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }

  static badRequest(message) {
    return new ApiError(400, message)
  }

  static internalError(message) {
    return new ApiError(500, message)
  }

  static notFound(message) {
    return new ApiError(404, message)
  }
}

module.exports = ApiError;