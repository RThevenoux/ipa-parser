const SegmentHelper = require("./segment-helper");
const VowelBackness = require("./../constants").Backness;
const VowelHeight = require("./../constants").Height;

module.exports = class VowelBuilder {
  constructor(vowel) {
    this.segmentHelper = SegmentHelper.createVowel();

    this.height = vowel.height;
    this.backness = vowel.backness;
    this.rounded = vowel.rounded;
    this.roundednessModifier = "none";
    this.nasalized = false;
    this.rhotacized = false;
    this.tongueRoot = "neutral";
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
          case "More rounded": this.roundednessModifier = "more"; break;
          case "Less rounded": this.roundednessModifier = "less"; break;
          case "Advanced tongue root": this.tongueRoot = "advanced"; break;
          case "Retracted tongue root": this.tongueRoot = "retracted"; break;
          case "Rhotacized": this.rhotacized = true; break;
          case "Nasalized": this.nasalized = true; break;

          case "Velarized or pharyngealized": //
          case "Labio-palatalized": //
          case "Labialized": //
          case "Palatalized": //
          case "Velarized": //
          case "Pharyngealized": //
          default: /*Err*/; break;
        }
      }; break;

      case "release": /*Err*/; break;
      default: // Err
    }
  }

  end() {
    return this.segmentHelper.buildWithValues({
      "height": this.height,
      "backness": this.backness,
      "rounded": this.rounded,
      "roundednessModifier": this.roundednessModifier,
      "nasalized": this.nasalized,
      "rhotacized": this.rhotacized,
      "tongueRoot": this.tongueRoot
    });
  }
}