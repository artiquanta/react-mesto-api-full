const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar, logout,
} = require('../controllers/users');
const { urlPattern, celebrateErrors } = require('../utils/utils');

// Запрос информации о всех пользователях
router.get('/', getUsers);

// Запрос информации о текущем пользователе
router.get('/me', getCurrentUser);

// Выход пользователя из системы
router.get('/logout', logout);

// Запрос информации о пользователе по ID
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).messages(celebrateErrors),
}), getUser);

// Обновление профиля пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).messages(celebrateErrors),
}), updateUser);

// Обновление аватара пользователя
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern),
  }).messages(celebrateErrors),
}), updateAvatar);

module.exports = router;
