const { BAD_REQUEST } = require("./errors");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = ValidationError;