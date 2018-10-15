const SegmentHelper = require("./segment-helper");
const VoicingHelper = require("./voicing-helper");

const coronals = ["dental",
  "alveolar",
  "postalveolar",
  "retroflex",
  "alveopalatal"];

const places = [
  "bilabial",
  "labiodental",
  "dental",
  "alveolar",
  "postalveolar",
  "retroflex",
  "alveopalatal",
  "palatal",
  "velar",
  "uvular",
  "pharyngal",
  "epiglottal",
  "glottal"
];

const placeMap = {};
for (let i = 0; i < places.length; i++) {
  placeMap[places[i]] = i;
}
function _orderPlace(places) {
  return places.map((name) => { return { "name": name, "index": placeMap[name] } }).sort((a, b) => a.index - b.index).map(data => data.name);
}

class Articulation {
  constructor(consonant) {
    this.places = consonant.places;
    this.lateral = consonant.lateral;
    this.manner = consonant.manner;
    this.voicingHelper = new VoicingHelper(consonant.voiced);
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
    } else if (coronals.includes(place)) {
      this.tongue = "apical";
    } else {
      // err
    };
  }

  _laminal() {
    if (this.places.length == 1 && coronals.includes(this.places[0])) {
      this.tongue = "laminal";
    } else {
      // err
    }
  }
}

module.exports = class ConsonantBuilder {
  constructor(consonant) {
    this.segmentHelper = SegmentHelper.createConsonant();
    this.state = "single-char";
    this.articulations = [new Articulation(consonant)];
    this.ejective = false;
  }

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.segmentHelper.addTone(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
      case "syllabicity": this.segmentHelper.updateSyllabicity(diacritic.label); break;
      case "phonation": this._getCurrentArticulation().updatePhonation(diacritic.label); break;
      case "articulation": this._getCurrentArticulation().updateArticulation(diacritic.label); break;
      case "ejective": this.ejective = true; break;
      case "release": /*TODO*/; break;
      case "co-articulation": /*TODO*/; break;
      default: // InternErr
    }
  }

  _getCurrentArticulation() {
    return this.articulations[this.articulations.length - 1];
  }

  addTieBar() {
    if (this.state === "single-char") {
      this.state = "expecting";
    } else {
      // SyntErr
    }
  }

  isExpectingConsonant() {
    return this.state === "expecting";
  }

  addConsonant(second) {
    if (!this.isExpectingConsonant()) {
      // SyntErr
      this.state = "error";
      return;
    }
    this.articulations.push(new Articulation(second));
    this.state = "double-char";
  }

  end() {
    if (this.isExpectingConsonant()) {
      // SyntErr
    }

    let data = this._resolveArticulations();
    data.ejective = this.ejective;
    data.places = _orderPlace(data.places);

    return this.segmentHelper.buildWithValues(data);
  }

  _resolveArticulations() {
    let first = this.articulations[0];

    if (this.articulations.length == 1) {
      // If only one articulations
      return {
        "voicing": first.voicingHelper.build(),
        "manner": first.manner,
        "places": first.places,
        "lateral": first.lateral
      }
    }

    // If two articulations
    let second = this.articulations[1];
    if (first.manner === "plosive" && second.manner === "fricative") {
      return this._resolveAffricate(first, second);
    } else if (first.manner === second.manner) {
      return this._resolveCoarticulation(first, second, first.manner);
    } else if (first.manner === "plosive" && second.manner === "implosive") {
      return this._resolveCoarticulation(first, second, "implosive");
    } else {
      return "error invalid articulations manner " + first.manner + " + " + second.manner;
    }
  }

  _resolveAffricate(first, second) {
    if (first.places.length != 1 && second.places.length != 1) {
      return "error affricate with more than one place " + first.places + " + " + second.places;
    }

    let firstPlace = first.places[0];
    let secondPlace = second.places[0];
    let firstVoiced = first.voicingHelper.voiced;
    let secondVoiced = second.voicingHelper.voiced;

    if (firstVoiced == secondVoiced) {
      let affricatePlace = this._computeAffricatePlace(firstPlace, secondPlace);
      if (affricatePlace == "error") {
        return "error invalid affricate place " + firstPlace + " + " + secondPlace;
      }

      return {
        "voicing": first.voicingHelper.buildWith(second.voicingHelper),
        "manner": "affricate",
        "places": affricatePlace,
        "lateral": second.lateral,
      }
    }

    // Ad-hoc case for 'ʡ͡ʕ'
    if (firstPlace == "epiglottal" && secondPlace == "pharyngeal"
      && firstVoiced == false) {
      return {
        "voicing": second.voicingHelper.build(),
        "manner": "affricate",
        "places": ["pharyngeal"],
        "lateral": second.lateral,
      }
    }

    // Invalid voicing combination
    return "error invalid voicing for affricate";
  }

  _computeAffricatePlace(firstPlace, secondPlace) {
    if (firstPlace == "alveolar") {
      return (coronals.includes(secondPlace) ? [secondPlace] : "error");
    } else if (firstPlace == "epiglottal") {
      return (secondPlace == "pharyngeal" ? [secondPlace] : "error");
    } else {
      return (secondPlace == firstPlace ? [secondPlace] : "error");
    }
  }

  _resolveCoarticulation(first, second, manner) {
    let lateral = first.lateral || second.lateral;
    let places = first.places.concat(second.places);

    let firstVoiced = first.voicingHelper.voiced;
    let secondVoiced = second.voicingHelper.voiced;

    if (firstVoiced != secondVoiced) {
      return "error invalid voicing for coarticulation";
    }

    return {
      "manner": manner,
      "voicing": first.voicingHelper.buildWith(second.voicingHelper),
      "lateral": lateral,
      "places": places
    };
  }
}