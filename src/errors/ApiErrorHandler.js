const ApiError = require('./ApiError');

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Something went wrong...' });
}

module.exports = apiErrorHandler;