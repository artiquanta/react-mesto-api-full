const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');

require('dotenv').config();

const { urlPattern, celebrateErrors, NOT_FOUND_CODE } = require('./utils/utils');
const { createUser, login } = require('./controllers/users');
const { logRequest, logError } = require('./middlewares/logger');

const app = express();

// Установка заголовков и частоты запросов
app.use(helmet());
app.use(rateLimit({
  windowMs: 450000,
  max: 250,
  message: {
    message: 'Слишком много запросов с одного IP. Попробуйте позже, через 7,5 минут',
  },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Регистрациия пользователя
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
  }).messages(celebrateErrors),
}), createUser);

// Авторизация пользователя
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).messages(celebrateErrors),
}), login);

// Проверка авторизации пользователя
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
app.use(require('./middlewares/celebrateErrorHandler'));

// Централизованный обработчик ошибок
app.use(require('./middlewares/errorHandler'));

mongoose.connect('mongodb://localhost:27017/mestodb');

module.exports = app;
