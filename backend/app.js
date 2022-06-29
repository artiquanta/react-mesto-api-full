const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, isCelebrateError } = require('celebrate');

require('dotenv').config();
const {
  urlPattern,
  celebrateErrors,
  DEFAULT_ERROR_CODE,
  NOT_FOUND_CODE,
} = require('./utils/utils');
const WrongDataError = require('./errors/wrong-data-err');

const { createUser, login } = require('./controllers/users');
const { logRequest, logError } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 450000,
  max: 250,
}));

// Логирование запросов
app.use(logRequest);

// CORS
app.use(require('./middlewares/cors'));

// Краш-тест
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
  }).messages(celebrateErrors),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).messages(celebrateErrors),
}), login);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик 404-ошибки
app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Страница не найдена. Проверьте ссылку',
  });
});

// Логирование ошибок
app.use(logError);

// Обработчик ошибок валидации celebrate
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(new WrongDataError(err.details.get('body').message));
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === DEFAULT_ERROR_CODE
        ? 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!'
        : message,
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

module.exports = app;
