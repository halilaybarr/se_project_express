const { INTERNAL_SERVER_ERROR } = require("./errors");

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = "DefaultError";
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = DefaultError;