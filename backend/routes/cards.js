const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { urlPattern, celebrateErrors } = require('../utils/utils');

// Запрос всех карточек
router.get('/', getCards);

// Создание карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlPattern),
  }).messages(celebrateErrors),
}), createCard);

// Удаление карточки
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).messages(celebrateErrors),
}), deleteCard);

// Добавления лайка карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).messages(celebrateErrors),
}), likeCard);

// Удаление лайка карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).messages(celebrateErrors),
}), dislikeCard);

module.exports = router;
