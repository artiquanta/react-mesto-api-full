const { isCelebrateError } = require('celebrate');

const WrongDataError = require('../errors/wrong-data-err');

// Обработчик ошибок валидации celebrate
module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    return next(new WrongDataError(err.details.get('body').message));
  }
  return next(err);
};
