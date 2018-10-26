module.exports = class IpaCharacterError extends Error {
  constructor(character) {
    super("Invalid IPA character: " + character);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IpaCharacterError);
    }
  }
}
