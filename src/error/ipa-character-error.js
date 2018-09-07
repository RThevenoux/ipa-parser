module.exports = class IpaCharacterError extends Error {
    constructor(character) {
        super("Invalid IPA character: " + character);
        Error.captureStackTrace(this, IpaCharacterError);
    }
}
