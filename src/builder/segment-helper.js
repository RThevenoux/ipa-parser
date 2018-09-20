const IpaSyntaxError = require("../error/ipa-syntax-error");

module.exports = class SegmentHelper {
  constructor(syllabic, voiced) {
    this.quantity = "short";
    this.syllabic = syllabic;
    this.voiced = voiced;
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

  getQuantity() {
    return this.quantity;
  }

  getVoiced() {
    return this.voiced;
  }

  getSyllabic() {
    return this.syllabic;
  }

}