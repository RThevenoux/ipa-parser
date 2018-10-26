module.exports = class IpaInternalError extends Error {
  constructor(message) {
    super("Unexpected Error. " + message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IpaInternalError);
    }
  }
}