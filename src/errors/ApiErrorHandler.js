const ApiError = require('./ApiError');

function apiErrorHandler(err, req, res, next) {
    
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }

  res.status(500).json('Something went wrong...');
}

module.exports = apiErrorHandler;