const SegmentHelper = require("./segment-helper");
const VowelBackness = require("./../constants").Backness;
const VowelHeight = require("./../constants").Height;

module.exports = class VowelBuilder {
  constructor(vowel) {
    this.segmentHelper = SegmentHelper.createVowel();

    this.height = vowel.height;
    this.backness = vowel.backness;
    this.rounded = vowel.rounded;
    this.nasalized = false;
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

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.segmentHelper.addTone(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
      case "syllabicity": this.segmentHelper.updateSyllabicity(diacritic.label); break;
      case "phonation": this.segmentHelper.updatePhonation(diacritic.label); break;
      case "release": /*Err*/; break;
      case "articulation": {
        switch (diacritic.label) {
          case "Advanced": this._advance(); break;
          case "Retracted": this._retracte(); break;
          case "Centralized": this._centralize(); break;
          case "Mid-centralized": this._midCendtralize(); break;
          case "Raised": this._raise(); break;
          case "Lowered": this._lower(); break;
          case "Dental": //
          case "Apical": //
          case "Linguolabial": //
          case "Laminal": //
          default: /*Err*/; break;
        }
      }; break;
      case "co-articulation": {
        switch (diacritic.label) {
          case "More rounded": break;
          case "Less rounded": break;
          case "Labialized": break;
          case "Palatalized": break;
          case "Labio-palatalized": break;
          case "Labialized without protrusion of the lips or velarization": break;
          case "Velarized": break;
          case "Pharyngealized": break;
          case "Velarized, uvularized or pharyngealized": break;
          case "Advanced tongue root": break;
          case "Retracted tongue root": break;
          case "Rhotacized": break;
          case "Nasalized": break;
          case "labial spreading": break;
          default: ;
        }
      }; break;
      default: // Err
    }
  }

  end() {
    return this.segmentHelper.buildWithValues({
      "height": this.height,
      "backness": this.backness,
      "rounded": this.rounded,
      "nasalized": this.nasalized
    });
  }
}