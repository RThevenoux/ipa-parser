const SegmentHelper = require("./segment-helper");
const Voicing = require("./voicing");
const VowelBackness = require("../constants").Backness;
const VowelHeight = require("../constants").Height;
const IpaSyntaxtError = require("../error/ipa-syntax-error");

module.exports = class VowelBuilder {
  constructor(vowel) {
    this.segmentHelper = new SegmentHelper();
    this.voicing = new Voicing(true);
    this.height = vowel.height;
    this.backness = vowel.backness;
    this.rounded = vowel.rounded;
    this.roundednessModifier = "none";
    this.nasalized = false;
    this.rhotacized = false;
    this.tongueRoot = "neutral";
  }

  _updatePhonation(label) {
    this.voicing.addDiacritic(label);
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

  _updateArticulation(label) {
    switch (label) {
      case "Advanced": this._advance(); break;
      case "Retracted": this._retracte(); break;
      case "Centralized": this._centralize(); break;
      case "Mid-centralized": this._midCendtralize(); break;
      case "Raised": this._raise(); break;
      case "Lowered": this._lower(); break;
      case "Dental": //fallthroug
      case "Apical": //fallthroug
      case "Linguolabial": //fallthroug
      case "Laminal": throw new IpaSyntaxtError("'" + label + "' diacritic is not supported by vowel");
      default: throw new IpaInternalError("Unsupported articulation: '" + label + "'");
    }
  }

  _updateRoundedness(label) {
    switch (label) {
      case "More rounded": this.roundednessModifier = "more"; break;
      case "Less rounded": this.roundednessModifier = "less"; break;
      default: throw new IpaInternalError("Unsupported roundedness: '" + label + "'");
    }
  }

  _updateTongueRoot(label){
    switch (label) {
      case "Advanced tongue root": this.tongueRoot = "advanced"; break;
      case "Retracted tongue root": this.tongueRoot = "retracted"; break;
      default: throw new IpaInternalError("Unsupported tongue-root: '" + label + "'");
    }
  }

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.segmentHelper.addTone(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
      case "syllabicity": this.segmentHelper.updateSyllabicity(diacritic.label); break;
      case "phonation": this._updatePhonation(diacritic.label); break;
      case "articulation": this._updateArticulation(diacritic.label); break;
      case "nasalized": this.nasalized = true; break;
      case "rhotacized": this.rhotacized = true; break;
      case "roundedness": this._updateRoundedness(diacritic.label); break;
      case "tongue-root": this._updateTongueRoot(diacritic.label); break;
      case "release": //fallthroug
      case "ejective"://fallthroug
      case "secondary-articulation":
        throw new IpaSyntaxtError("'" + diacritic.type + "' diacritic is not supported by vowel");
      default: throw new IpaInternalError("Unsupported diacritic type: '" + diacritic.type + "'");
    }
  }

  end() {
    return this.segmentHelper.buildVowel({
      "voicing": this.voicing.build(),
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