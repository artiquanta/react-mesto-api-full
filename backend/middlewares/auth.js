const { verify } = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-err');
const { secretKey } = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new NotAuthorizedError('Ошибка авторизации');
  }

  let payload;

  try {
    payload = verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    throw new NotAuthorizedError('Ошибка авторизации');
  }

  req.user = payload;
  next();
};
