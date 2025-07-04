const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = BAD_REQUEST;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = NOT_FOUND;
  }
}

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = "DefaultError";
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  ValidationError,
  NotFoundError,
  DefaultError,
};

