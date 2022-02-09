class HttpError extends Error {
  constructor(message, code) {
    super(message);  // add message property
    this.code = code;  // add code property
  }
}

module.exports = HttpError;