const { transports, format } = require('winston');
const { logger, errorLogger } = require('express-winston');
require('winston-daily-rotate-file');

// Логирование запросов
const logRequest = logger({
  transports: [
    new transports.DailyRotateFile({
      filename: './logs/requests/mesto-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH-mm',
      maxSize: '10m',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
});

// Логирование ошибок
const logError = errorLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: './logs/errors/mesto-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH-mm',
      maxSize: '10m',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
});

module.exports = { logRequest, logError };
