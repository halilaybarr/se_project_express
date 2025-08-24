const { AUTHORIZATION_ERROR } = require("./errors");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = AUTHORIZATION_ERROR;
  }
}

module.exports = UnauthorizedError;
