const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const User = require('../models/user');
const { secretKey } = require('../utils/utils');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrong-data-err');
const AlreadyExistError = require('../errors/already-exist-err');
const NotAuthorizedError = require('../errors/not-authorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  hash(password, 10)
    .then(passwordHash => User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    }))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistError('Указанный Email уже зарегистрирован'));
      }
      return next(err);
    });
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(user => {
      const token = sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          domain: 'quantum.nomoredomains.xyz',
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .cookie('auth', 'active', {
          domain: 'quantum.nomoredomains.xyz',
          maxAge: 604800000,
          sameSite: true,
        })
        .send({ message: 'Вы успешно авторизовались' });
    })
    .catch(() => {
      next(new NotAuthorizedError('Некорректные почта или пароль'));
    });
};

// Выход пользователя из системы
module.exports.logout = (req, res, next) => {
  res
    .clearCookie('jwt', {
      domain: 'quantum.nomoredomains.xyz',
      httpOnly: true,
      sameSite: true,
    })
    .clearCookie('auth', {
      domain: 'quantum.nomoredomains.xyz',
      sameSite: true,
    })
    .send({ message: 'Вы успешно вышли из системы. До скорой встречи' });
};

// Запрос всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(next);
};

// Запрос информации о конкретном пользователе
module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new WrongDataError('Указан некорректный формат _id пользователя'));
      }
      return next(err);
    });
};

// Запрос информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new WrongDataError('Указан некорректный формат _id пользователя'));
      }
      return next(err);
    });
};

// Обновление профиля пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => next(new NotFoundError('Пользователь с указанным _id не найден')))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => next(new NotFoundError('Пользователь с указанным _id не найден')))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};
