const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const { compare } = require('bcryptjs');
const { urlPattern } = require('../utils/utils');

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return urlPattern.test(v);
      },
      message: 'Указан некорректный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Указан некорректный формат Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('Неправильный логин или пароль'));
      }
      return compare(password, user.password)
        .then(matched => {
          if (!matched) {
            return Promise.reject(new Error('Неправильный логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = model('user', userSchema);
