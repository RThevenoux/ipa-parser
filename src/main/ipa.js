var IpaParserFactory = require("./ipa-parser-factory");

const IPA_NASAL_MARK = '\u0303'; // COMBINING TILDE
const IPA_LONG_MARK = '\u02D0'; // MODIFIER LETTER TRIANGULAR COLON

module.exports = class Ipa {
  constructor() {
    this.parserFactory = new IpaParserFactory();
  }

  getParser() {
    if (this.singleton) {
      return this.singleton;
    } else {
      this.singleton = this.parserFactory.get()
      return this.singleton;
    }
  }
}