var AbstractPhoneme = require('./abstract-phoneme');

const VowelBackness = Object.freeze({
  "FRONT": 2,
  "NEAR_FRONT": 1,
  "CENTRAL": 0,
  "NEAR_BACK": -1,
  "BACK": -2
});

const VowelHeight = Object.freeze({
  "CLOSE": 3,
  "NEAR_CLOSE": 2,
  "CLOSE_MID": 1,
  "MID": 0,
  "OPEN_MID": -1,
  "NEAR_OPEN": -2,
  "OPEN": -3
});

class VowelPhoneme extends AbstractPhoneme {

  /**
   * @param {IpaSymbol} symbol 
   */
  constructor(symbol) {
    super(symbol.base, "vowel");
    this.height = symbol.height;
    this.backness = symbol.backness;
    this.rounded = symbol.rounded
  }

  updateArticulation(symbol) {
    switch (symbol.diacritic.label) {
      case "Advanced": this._advance(); break;
      case "Retracted": this._retracte(); break;
      case "Centralized": this._centralize(); break;
      case "Mid-centralized": this._midCendtralize(); break;
      case "Raised": this._raise(); break;
      case "Lowered": this._lower(); break;
    }
  }

  _centralize() {
    this.backness = VowelBackness.CENTRAL;
  }

  _midCendtralize() {
    if (this.backness > 0) {
      this.backness--;
    } else if (this.backness < 0) {
      this.backness++;
    }

    if (this.height > 0) {
      this.height--;
    } else if (this.height < 0) {
      this.height++;
    }
  }

  _lower() {
    this.height += -1;
  }

  _raise() {
    this.height += +1;
  }

  _advance() {
    this.backness += +1;
  }

  _retracte() {
    this.backness += -1;
  }
}

module.exports = VowelPhoneme;
module.exports.Height = VowelHeight;
module.exports.Backness = VowelBackness;