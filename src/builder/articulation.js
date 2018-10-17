const VoicingHelper = require("./voicing-helper");
const Place = require("./place");

module.exports = class Articulation {
  constructor(consonant) {
    this.places = consonant.places;
    this.lateral = consonant.lateral;
    this.nasal = consonant.nasal;
    this.manner = consonant.manner;
    this.voicingHelper = new VoicingHelper(consonant.voiced);
    this.tongue = "unspecified";
  }

  updatePhonation(label) {
    this.voicingHelper.addDiacritic(label);
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
      default: /*Err*/; break;
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


  // TODO : finish lower/raise
  // see https://en.wikipedia.org/wiki/Relative_articulation#Raised_and_lowered
  //
  // [close vowel]-[approximant]--[fricative]---------[stop]
  //                              [tap  fric]--[flap]-[stop]
  //                     [trill]--[tril fric]-- XXX
  //
  // trilled fricative = trill + fricative ? => https://en.wikipedia.org/wiki/Dental,_alveolar_and_postalveolar_trills#Voiced_alveolar_fricative_trill
  // https://en.wikipedia.org/wiki/Fricative_consonant :
  //  - fricative trill 
  //  - fricative flap
  // https://en.wikipedia.org/wiki/Flap_consonant#Tapped_fricatives
  // One fricative flap : https://en.wikipedia.org/wiki/Voiced_alveolar_fricative#Voiced_alveolar_non-sibilant_fricative
  // 
  _lower() {
    switch (this.manner) {
      case "stop": {
        this.manner = "fricative";
        // ignore flap case ?
      }; break;
      case "fricative": {
        if (this.trilled) {
          this.manner = "trill";
        } else {
          this.manner = "approximant";
        }
      }; break;
      case "approximant": this.manner = "vowel";
        break;
      case "flap":
      case "trill":
      default:
      // err
    }
  }

  _raise() {
    switch (this.manner) {
      case "stop": //err
        break;
      case "fricative": {
        if (this.trilled) {
          // err ?
        } else {
          this.manner = "stop";
        }
      }; break;
      case "approximant": this.manner = "fricative"; break;
      case "flap": this.manner = "stop";
        break;
      case "trill":
        this.manner = "fricative";
        this.trilled = true; // !!!!!!!
        break;
    }
  }

  _dental() {
    if (this.places.length > 1) {
      console.log("More than one place with 'dental' diacrtic");
    }

    switch (this.places[0]) {
      case "alveolar": this.places = ["dental"]; break;
      case "bilabial": this.places = ["labiodental"]; break;
      default: console.log("'dental' diacritic on invalid place " + this.places[0]);
    }
  }

  _lingolabial() {
    this.places = ["linguolabial"];
  }

  _apical() {
    let place = this.places[0];
    if (place == "bilabial") {
      this.places = ["linguolabial"];
      this.tongue = "apical";
    } else if (Place.isCoronal(place)) {
      this.tongue = "apical";
    } else {
      // err
    };
  }

  _laminal() {
    if (this.places.length == 1 && Place.isCoronal(this.places[0])) {
      this.tongue = "laminal";
    } else {
      // err
    }
  }
}
