module.exports = class IpaSyntaxError extends Error {
  constructor(message) {
    super("Invalid IPA syntax." + message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IpaSyntaxError);
    }
  }
}