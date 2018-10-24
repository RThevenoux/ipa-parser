const ToneMarkHelper = require("./tone-mark-helper");
const IpaSyntaxError = require("../error/ipa-syntax-error");
const IpaInternError = require("../error/ipa-internal-error");

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
      case "extra-short": //fallthroug
      case "half-long": //fallthroug
      case "extra-long": throw new IpaSyntaxError("Unexpected quantity symbol: '" + label + "' current quantity: " + this.quantity);
      case "long":
        if (label != "long") throw new IpaSyntaxError("Unexpected quantity symbol: " + label + " current quantity: " + this.quantity);
        this.quantity = "extra-long";
        break;
      case "short": this.quantity = label; break;
      default: throw new IpaInternError("Unsupported quantity label: '" + label + "'");
    }
  }

  updateSyllabicity(label) {
    if (this.syllabicModifier != "none") throw new IpaSyntaxtError("Do not supported more than one syllabic modifier");

    switch (label) {
      case "Syllabic": this.syllabicModifier = "+syllabic"; break;
      case "Non-syllabic": this.syllabicModifier = "-syllabic"; break;
      default: throw new IpaInternError("Unsupported syllabicity label: '" + label + "'");
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