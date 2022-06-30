const { DEFAULT_ERROR_CODE } = require('../utils/utils');

// Централизованный обработчик ошибок
module.exports = (err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === DEFAULT_ERROR_CODE
        ? 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!'
        : message,
    });
};
