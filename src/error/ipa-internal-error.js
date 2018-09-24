module.exports = class IpaInternalError extends Error {
  constructor(message) {
    super("Unexpected Error. " + message);
    Error.captureStackTrace(this, IpaInternalError);
  }
}