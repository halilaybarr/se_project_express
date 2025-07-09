const { FORBIDDEN_ERROR } = require("./errors");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = ForbiddenError;
