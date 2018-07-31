var AbstractPhoneme = require('./abstract-phoneme');

module.exports = class ConsonantPhoneme extends AbstractPhoneme {

  /**
   * @param {IpaSymbol} symbol 
   */
  constructor(symbol) {
    super(symbol.base, "consonant");
  }

  /**
  * @param {String} char 
  */
  combineBase(char) {
    this.base += char;
  }

  updateArticulation(symbol) {
    //
  }
}