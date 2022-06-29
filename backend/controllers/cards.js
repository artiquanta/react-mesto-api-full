const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrong-data-err');
const ForbiddenError = require('../errors/forbidden-err');

// Запрос всех карточек мест
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch((err) => next(err));
};

// Создание карточки места
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

// Удаление карточки места
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then(card => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then(() => {
      res.send({
        message: 'Карточка места удалена',
      });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Карточка с указанным _id не найдена'));
      }
      next(err);
    });
};

// Добавления лайка для карточки
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Переданы некорректные данные для постановки лайка'));
      }
      next(err);
    });
};

// Снятие лайка с карточки
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Переданы некорректные данные для постановки лайка'));
      }
      next(err);
    });
};
