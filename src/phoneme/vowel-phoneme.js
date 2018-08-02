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
    super(symbol.base, "vowel", true, true);
    this.height = symbol.height;
    this.backness = symbol.backness;
    this.rounded = symbol.rounded;
  }

  /**
  * @param {String} label 
  */
  updateArticulation(label) {
    switch (label) {
      case "Advanced": this._advance(); break;
      case "Retracted": this._retracte(); break;
      case "Centralized": this._centralize(); break;
      case "Mid-centralized": this._midCendtralize(); break;
      case "Raised": this._raise(); break;
      case "Lowered": this._lower(); break;

      // Consonnant only
      case "Dental":
      case "Apical":
      case "Linguolabial":
      case "Laminal":
      default: /* TODO erreur */; break;
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
    if (this.height > VowelHeight.OPEN) {
      this.height += -1;
    }
  }

  _raise() {
    if (this.height < VowelHeight.CLOSE) {
      this.height += +1;
    }
  }

  _advance() {
    if (this.backness < VowelBackness.FRONT) {
      this.backness += +1;
    }
  }

  _retracte() {
    if (this.backness > VowelBackness.BACK) {
      this.backness += -1;
    }
  }
}

module.exports = VowelPhoneme;
module.exports.Height = VowelHeight;
module.exports.Backness = VowelBackness;