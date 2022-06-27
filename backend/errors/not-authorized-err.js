// Класс ошибки 401
class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAuthorized';
    this.statusCode = 401;
  }
}

module.exports = NotAuthorizedError;
