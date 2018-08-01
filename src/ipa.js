var IpaParserFactory = require("./ipa-parser-factory");

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