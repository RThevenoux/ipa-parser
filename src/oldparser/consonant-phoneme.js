var AbstractPhoneme = require('./abstract-phoneme');

module.exports = class ConsonantPhoneme extends AbstractPhoneme {

  /**
   * @param {IpaSymbol} symbol 
   */
  constructor(symbol) {
    super(symbol.base, "consonant", false, symbol.voiced);
    this.manner = symbol.manner;
    this.place = symbol.place;
    this.lateral = symbol.lateral;
  }

  /**
  * @param {String} label 
  */
  updateArticulation(label) {
    // TODO !!!
    switch (label) {
      // Place
      case "Dental": this.place = dental; break;
      case "Linguolabial": ; break;
      case "Advanced": ; break;
      case "Retracted": ; break;
     
      // Tongue
      case "Apical": ; break;
      case "Laminal": ; break;
      
      // Manner
      case "Raised": ; break;
      case "Lowered": ; break;

      // Vowel only
      case "Centralized":
      case "Mid-centralized":
      default: /*TODO error*/; break;
    }
  }
}