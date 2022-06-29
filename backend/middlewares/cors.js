const { allowedCors, DEFAULT_ALLOWED_METHODS } = require('../utils/utils');

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedCors.includes(origin)) {
    // Разрешение крос-доменных запросов для доверенных доменов
    res.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    });

    // Обработка предварительного запроса
    if (method === 'OPTIONS') {
      res.set({
        'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS,
        'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
      });
      return res.end();
    }
  }

  return next();
};
