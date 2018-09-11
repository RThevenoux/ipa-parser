var IpaQuantity = require('./ipa-quantity');

module.exports = class AbstractPhoneme {
  constructor(base, type, syllabic, voiced) {
    this.base = base;
    this.type = type;
    this.coarticulation = [];
    this.syllabic = syllabic;
    this.voiced = voiced;
    this.quantity = new IpaQuantity();
  }

  /**
  * @param {String} char 
  */
  combineBase(char) {
    this.base += char;
  }

  /**
   * 
   * @param {String} label 
   */
  updateArticulation(label) {
    // Need to be Override
  }

  /**
   * 
   * @param {String} label 
   */
  addCoarticulation(label) {
    // TODO rounded : 'more'/'less', not both
    // TODO ATR : only for vowel. 'Advanced'/'Retracted', not both

    this.coarticulation.push(label);
  }

  /**
  * 
  * @param {String} label 
  */
  updateSyllabicity(label) {
    switch (label) {
      case "Syllabic": this.syllabic = true; break;
      case "Non-syllabic": this.syllabic = false; break;
    }
  }

  /**
  * @param {String} label 
  */
  updatePhonation(label) {
    switch (label) {
      case "Voiceless": this.voiced = false; break;
      case "Voiced": this.voiced = true; break;
      case "Murmured": /*TODO*/; break;
      case "Creaky voice": /*TODO*/; break;
    }
  }
}