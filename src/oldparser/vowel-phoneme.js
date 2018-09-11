var AbstractPhoneme = require('./abstract-phoneme');

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