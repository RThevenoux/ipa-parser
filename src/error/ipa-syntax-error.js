module.exports = class IpaSyntaxError extends Error {
    constructor(message) {
        super("Invalid IPA syntax." + message);
        Error.captureStackTrace(this, IpaSyntaxError);
    }
}