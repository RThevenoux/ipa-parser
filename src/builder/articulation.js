const Voicing = require("./voicing");
const Manner = require("./manner");
const IpaSyntaxtError = require("../error/ipa-syntax-error");
const IpaInternError = require("../error/ipa-internal-error");

module.exports = class Articulation {
  constructor(consonant, placeIndex) {
    this.place = consonant.places[placeIndex];
    this.lateral = consonant.lateral;
    this.nasal = consonant.nasal;
    this.manner = consonant.manner;
    this.voicing = new Voicing(consonant.voiced);
    this.coronalType = "unspecified";
  }

  updatePhonation(label) {
    this.voicing.addDiacritic(label);
  }

  updateArticulation(label) {
    switch (label) {
      case "Advanced": this._advance(); break;
      case "Retracted": this._retracte(); break;
      case "Raised": this._raise(); break;
      case "Lowered": this._lower(); break;
      case "Dental": this._dental(); break;
      case "Linguolabial": this._lingolabial(); break;
      case "Apical": this._apical(); break;
      case "Laminal": this._laminal(); break;
      case "Centralized": /*err*/; break;
      case "Mid-centralized": /*err*/; break;
      default: throw new IpaInternError("Unsupported articulation label: '" + label + "'");
    };
  }

  nasalized() {
    this.nasal = true;
  }

  // TODO advance/retracte
  // see https://en.wikipedia.org/wiki/Relative_articulation#Advanced_and_retracted
  // https://en.wikipedia.org/wiki/Bilabial_flap
  _advance() {
  }
  _retracte() {
  }

  _lower() {
    this.manner = Manner.lower(this.manner);
  }

  _raise() {
    this.manner = Manner.raise(this.manner);
  }

  _dental() {
    switch (this.place) {
      case "alveolar": this.place = "dental"; break;
      case "bilabial": this.place = "labiodental"; break;
      default: throw new IpaSyntaxtError("'dental' diacritic on invalid place: '" + this.place + "'");
    }
  }

  _lingolabial() {
    this.place = "linguolabial";
  }

  _apical() {
    this.coronalType = "apical";

    if (this.place == "bilabial") {
      this.place = "linguolabial";
    }
  }

  _laminal() {
    this.coronalType = "laminal";
  }

  isVoiced() {
    return this.voicing.voiced;
  }
}
