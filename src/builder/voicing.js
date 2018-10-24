const IpaSyntaxtError = require("../error/ipa-syntax-error");

module.exports = class VoicingHelper {
  constructor(voiced) {
    this.voiced = voiced;
    this.phonation = voiced ? "modal" : "voiceless";
  }

  addDiacritic(label) {
    switch (label) {
      case "Voiceless": {
        this.voiced = false;
        this.phonation = "voiceless";
      }; break;
      case "Voiced": {
        this.voiced = true;
        this.phonation = "modal";
      }; break;
      case "Breathy voice": {
        this.voiced = true;
        this.phonation = "breathy";
      }; break;
      case "Creaky voice": {
        this.voiced = true;
        this.phonation = "creaky";
      }; break;
      default: throw new IpaInternalError("Unsupported voicing label: '" + label + "'");
    }
  }

  build() {
    return {
      "voiced": this.voiced,
      "phonation": this.phonation,
    }
  }
}

module.exports.merge = function(first, second) {
  if (second.voiced != first.voiced) {
    throw new IpaSyntaxtError("Can not merge. Not same voicing");
  }

  let phonation = (first.phonation == "modal" ? second.phonation : first.phonation);

  return {
    "voiced": first.voiced,
    "phonation": phonation
  }
}