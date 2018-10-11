const IpaSyntaxError = require("../error/ipa-syntax-error");
const ToneMarkHelper = require("./tone-mark-helper");

class SegmentHelper {
  constructor(category, syllabic) {
    this.category = category;
    this.quantity = "short";
    this.syllabic = syllabic;
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
    switch (label) {
      case "Syllabic": this.syllabic = true; break;
      case "Non-syllabic": this.syllabic = false; break;
      default: // InternErr
    }
  }

  buildWithValues(values) {
    let segment = {
      "segment": true,
      "category": this.category,
      "quantity": this.quantity,
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
  createVowel: () => new SegmentHelper("vowel", true),
  createConsonant: () => new SegmentHelper("consonant", false)
}