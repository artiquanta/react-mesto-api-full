const { transports, format } = require('winston');
const { logger, errorLogger } = require('express-winston');

const logRequest = logger({
  transports: [
    new transports.File({ filename: 'request.log' }),
  ],
  format: format.json(),
});

const logError = errorLogger({
  transports: [
    new transports.File({ filename: 'error.log' }),
  ],
  format: format.json(),
});

module.exports = { logRequest, logError };
