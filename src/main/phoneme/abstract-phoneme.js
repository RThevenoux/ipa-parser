var IpaQuantity = require('./ipa-quantity');

module.exports = class AbstractPhoneme {
  constructor(base, type) {
    this.base = base;
    this.type = type;
    this.coarticulation = [];
    this.quantity = new IpaQuantity();
  }

  /**
   * 
   * @param {IpaSymbol} symbol 
   */
  updateArticulation(symbol) {
    // Need to be Override
  }

  /**
   * 
   * @param {IpaSymbol} symbol 
   */
  updateCoarticulation(symbol) {
    this.coarticulation.push(symbol.diacritic.label);
  }
}