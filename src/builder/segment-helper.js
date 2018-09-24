const IpaSyntaxError = require("../error/ipa-syntax-error");
const ToneMarkHelper = require("./tone-mark-helper");

class SegmentHelper {
  constructor(category, syllabic, voiced) {
    this.category = category;
    this.quantity = "short";
    this.syllabic = syllabic;
    this.voiced = voiced;
    this.toneMarkHelper = new ToneMarkHelper();
  }

  addTone(toneLabel){
    this.toneMarkHelper.addTone(toneLabel);
  }

  updateQuantity(label) {
    switch (this.quantity) {
      case "extra-short":
      case "half-long":
      case "extra-long":
        this._exception(label);
      case "long":
        if (label === "long") {
          this.quantity = "extra-long";
        } else {
          this._exception(label);
        }
        break;
      case "short": {
        this.quantity = label;
      }
    }
  }

  updateSyllabicity(label) {
    switch (label) {
      case "Syllabic": this.syllabic = true; break;
      case "Non-syllabic": this.syllabic = false; break;
    }
  }

  updatePhonation(label) {
    switch (label) {
      case "Voiceless": this.voiced = false; break;
      case "Voiced": this.voiced = true; break;
      case "Murmured": //TODO;
        break;
      case "Creaky voice": //TODO;
        break;
    }
  }

  _exception(label) {
    throw new IpaSyntaxError("Unexpected quantity symbol: " + label + " current quantity: " + this.quantity);
  }

  getVoiced() {
    return this.voiced;
  }

  getSyllabic() {
    return this.syllabic;
  }

  buildWithValues(values) {
    let segment = {
      "segment": true,
      "category": this.category,
      "quantity": this.quantity,
      "voiced": this.voiced,
      "syllabic": this.syllabic
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
}

// Export two Factory method
module.exports = {
  createVowel: () => new SegmentHelper("vowel", true, true),
  createConsonant: (consonant) => new SegmentHelper("consonant", false, consonant.voiced)
}