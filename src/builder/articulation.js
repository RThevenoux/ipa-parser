const VoicingHelper = require("./voicing-helper");
const Place = require("./place");

module.exports = class Articulation {
  constructor(consonant) {
    this.places = consonant.places;
    this.lateral = consonant.lateral;
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

  _advance() {
    // TODO
    // see https://en.wikipedia.org/wiki/Relative_articulation#Advanced_and_retracted
  }

  _retracte() {
    // TODO
    // see https://en.wikipedia.org/wiki/Relative_articulation#Advanced_and_retracted
  }


  // TODO
  // see https://en.wikipedia.org/wiki/Relative_articulation#Raised_and_lowered
  //
  // <-raised-[close vowel]-[approximant]-[fricative]-[stop]--lowered->
  //          [close V + ~]-[approx+~]----[fric+~]----[nasal]
  //                                      [flap]------[stop]
  //                        [trill]-------[tril fric]
  //
  _raise() {
    // TODO

  }

  _lower() {
    // TODO
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
