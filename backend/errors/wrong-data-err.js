// Класс ошибки 400
class WrongDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongDataError';
    this.statusCode = 400;
  }
}

module.exports = WrongDataError;
