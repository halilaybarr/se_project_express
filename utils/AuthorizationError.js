const { AUTHORIZATION_ERROR } = require("./errors");

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = AUTHORIZATION_ERROR;
  }
}

module.exports = AuthorizationError;
