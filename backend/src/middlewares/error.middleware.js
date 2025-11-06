const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err);

  const status = err.status || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
