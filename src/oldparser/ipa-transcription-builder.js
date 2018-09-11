var VowelPhoneme = require('./vowel-phoneme');
var ConsonantPhoneme = require('./consonant-phoneme');

module.exports = class IpaTranscriptionBuilder {
  constructor() {
    this.phonemes = [];
    this.pendingPhoneme = null;
    this.combining = false;
  }

  /**
   * @param {IpaSymbol} symbol 
   */
  add(symbol) {
    if (this.combining) {
      switch (symbol.type) {
        case "vowel":
        case "consonant":
          this.pendingPhoneme.combineBase(symbol.base);
          this.combining = false;
          break;
        default:
          throw this._unexpectedSymbol(symbol);
      }
    } else {
      switch (symbol.type) {
        case "combining": this._combining(symbol); break;
        case "diacritic": this._diacritic(symbol); break;
        case "vowel": this._vowel(symbol); break;
        case "consonant": this._consonant(symbol); break;
        default: break;
      }
    }
  }

  /**
   * @returns {AbstractPhoneme[]} 
   */
  end() {
    this._endPhoneme();
    return this.phonemes;
  }

  _consonant(symbol) {
    this._endPhoneme();
    this.pendingPhoneme = new ConsonantPhoneme(symbol);
  }

  _combining(symbol) {
    if (!this.pendingPhoneme) {
      throw this._unexpectedSymbol(symbol);
    }
    this.combining = true;
  }

  _diacritic(symbol) {
    if (!this.pendingPhoneme) {
      throw this._unexpectedSymbol(symbol);
    }

    let label = symbol.diacritic.label;
    switch (symbol.diacritic.type) {
      case "co-articulation":
        this.pendingPhoneme.addCoarticulation(label);
        break;
      case "length":
        this.pendingPhoneme.quantity.update(label);
        break;
      case "articulation":
        this.pendingPhoneme.updateArticulation(label);
        break;
      case "syllabicity": {
        this.pendingPhoneme.updateSyllabicity(label);
        break;
      }
      case "phonation":{
        this.pendingPhoneme.updatePhonation(label);
      }
      // TODO-1 : release 
      // TODO-2 : prosody
    }
  }

  _vowel(symbol) {
    this._endPhoneme();
    this.pendingPhoneme = new VowelPhoneme(symbol);
  }

  _endPhoneme() {
    if (this.pendingPhoneme) {
      this.phonemes.push(this.pendingPhoneme);
      this.pendingPhoneme = null;
    }
  }

  _unexpectedSymbol(symbol) {
    return new Exception("Unexpected symbol. Combining= " + this.combining
      + "isPendingPhonemen= " + (this.pendingPhoneme ? true : false)
      + ", symboleType= " + symbol.type + ", symbol: " + symbol.base);
  }
}