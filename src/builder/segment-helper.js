const IpaSyntaxError = require("../error/ipa-syntax-error");
const ToneMarkHelper = require("./tone-mark-helper");

module.exports = class SegmentHelper {
  constructor() {
    this.quantity = "short";
    this.syllabicModifier = "none";
    this.toneMarkHelper = new ToneMarkHelper();
  }

  addTone(toneLabel) {
    this.toneMarkHelper.addTone(toneLabel);
  }

  updateQuantity(label) {
    switch (this.quantity) {
      case "extra-short":
      case "half-long":
      case "extra-long":
        throw new IpaSyntaxError("Unexpected quantity symbol: " + label + " current quantity: " + this.quantity);;
      case "long":
        if (label === "long") {
          this.quantity = "extra-long";
        } else {
          throw new IpaSyntaxError("Unexpected quantity symbol: " + label + " current quantity: " + this.quantity);
        }
        break;
      case "short": {
        this.quantity = label;
      }
      default: // InternErr
    }
  }

  updateSyllabicity(label) {
    if (this.syllabicModifier != "none") {
      // SyntaxErr
    }

    switch (label) {
      case "Syllabic": this.syllabicModifier = "+syllabic"; break;
      case "Non-syllabic": this.syllabicModifier = "-syllabic"; break;
      default: // InternErr
    }
  }

  buildConsonant(values) {
    return this._build("consonant", false, values);
  }

  buildVowel(values) {
    return this._build("vowel", true, values);
  }

  _build(category, defaultSyllabicity, values) {
    let syllabic = this._computeSyllabic(defaultSyllabicity);

    let segment = {
      "segment": true,
      "category": category,
      "quantity": this.quantity,
      "syllabic": syllabic
    }

    for (let key in values) {
      segment[key] = values[key];
    }

    let result = [segment];

    if (this.toneMarkHelper.isTone()) {
      result.push(this.toneMarkHelper.buildTone());
    }

    return result;
  }

  _computeSyllabic(defaultSyllabicity) {
    switch (this.syllabicModifier) {
      case "+syllabic": return true;
      case "-syllabic": return false;
      default: return defaultSyllabicity;
    }
  }
}