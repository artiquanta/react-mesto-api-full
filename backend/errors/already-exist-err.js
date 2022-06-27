// Класс ошибки 409
class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyExist';
    this.statusCode = 409;
  }
}

module.exports = AlreadyExistError;
