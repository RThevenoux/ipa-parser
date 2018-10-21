const SegmentHelper = require("./segment-helper");
const Articulation = require("./articulation");
const Place = require("./place");
const IpaSyntaxtError = require("../error/ipa-syntax-error");

function _mergeRelease(first, second) {
  if (first == "unaspirated") return second;
  if (second == "unaspirated") return first;
  throw new IpaSyntaxtError("Can not merge releases : '" + first + "' + '" + second + "'");
}

function _mergeVoicing(first, second) {
  if (second.voiced != first.voiced) {
    throw new IpaSyntaxtError("Can not merge. Not same voicing");
  }

  let phonation = (first.phonation == "modal" ? second.phonation : first.phonation);

  return {
    "voiced": first.voiced,
    "phonation": phonation
  }
}

function _isSameVoicing(articulation1, articulation2) {
  return articulation1.voicingHelper.voiced == articulation2.voicingHelper.voiced;
}

module.exports = class ConsonantBuilder {
  constructor(consonant) {
    this.state = "single-char";

    this.segmentHelper = new SegmentHelper();
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
      case "release": this._getCurrentArticulation().updateRelease(diacritic.label); break;
      case "co-articulation":
        switch (diacritic.label) {
          case "Nasalized": this._getCurrentArticulation().nasalized(); break;
          case "Velarized or pharyngealized": //
          case "Labialized": //
          case "Palatalized": //
          case "Velarized": //
          case "Pharyngealized": //
          case "Labio-palatalized": //
          case "More rounded":
          case "Less rounded":
            //TODO  
            break;

          case "Advanced tongue root":
          case "Retracted tongue root":
          case "Rhotacized":
            // SyntErr
            break;
          default:
            // InternErr
            break;
        }
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
      throw new IpaSyntaxtError("Unexpected tie-bar. State=" + this.state);
    }
  }

  isExpectingConsonant() {
    return this.state === "expecting";
  }

  addConsonant(second) {
    if (!this.isExpectingConsonant()) {
      throw new IpaSyntaxtError("Unexpected second articulation. State=" + this.state);
    }
    this.articulations.push(new Articulation(second));
    this.state = "double-char";
  }

  end() {
    if (this.isExpectingConsonant()) {
      throw new IpaSyntaxtError("Unexpected end of consonant. Expected second articulation. State=" + this.state);
    }

    let data = this._resolveArticulations();

    data.places = Place.orderPlaces(data.places);

    if (data.manner == "vowel") {
      return this._buildVowel(data);
    } else {
      data.ejective = this.ejective;
      return this.segmentHelper.buildConsonant(data);
    }
  }

  _buildVowel(data) {
    // see : https://en.wikipedia.org/wiki/Approximant_consonant#Semivowels
    let backness;
    if (data.places[data.places.length - 1] == "palatal") {
      backness = 2;
    } else {
      backness = -2;
    }
    let rounded = (data.places[0] == "bilabial");

    let values = {
      "voicing": data.voicing,
      "height": 3,
      "backness": backness,
      "rounded": rounded,
      "roundednessModifier": "none",
      "nasalized": data.nasal,
      "rhotacized": false,
      "tongueRoot": "neutral"
    };

    return this.segmentHelper.buildVowel(values);

  }

  _resolveArticulations() {
    let first = this.articulations[0];

    if (this.articulations.length == 1) {
      // If there is only one articulation

      let result = {
        "voicing": first.voicingHelper.build(),
        "manner": first.manner,
        "places": first.places,
        "lateral": first.lateral,
        "nasal": first.nasal,
        "release": first.release
      }

      if (first.places.some(name => Place.isCoronal(name))) {
        result.coronalType = first.coronalType;
      }

      return result;
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
      throw new IpaSyntaxtError("Invalid articulations manner: '" + first.manner + "' + '" + second.manner + "'");
    }
  }

  _resolveAffricate(first, second) {
    if (first.places.length != 1 && second.places.length != 1) {
      throw new IpaSyntaxtError("Affricate with more than one place: '" + first.places + "' + '" + second.places + "'");
    }

    let firstPlace = first.places[0];
    let secondPlace = second.places[0];

    if (_isSameVoicing(first, second)) {
      let affricatePlace = this._computeAffricatePlace(firstPlace, secondPlace);

      let result = {
        "manner": "affricate",
        "voicing": _mergeVoicing(first.voicingHelper, second.voicingHelper),
        "places": [affricatePlace],
        "lateral": second.lateral,
        "nasal": second.nasal,
        "release": _mergeRelease(first.release, second.release)
      }

      if (Place.isCoronal(affricatePlace)) {
        result.coronalType = Place.mergeCoronalType(first.coronalType, second.coronalType);
      }

      return result;
    }

    // Ad-hoc case for 'ʡ͡ʕ'
    if (firstPlace == "epiglottal" && secondPlace == "pharyngeal"
      && first.voicingHelper.voiced == false) {
      return {
        "voicing": second.voicingHelper.build(),
        "manner": "affricate",
        "places": ["pharyngeal"],
        "lateral": second.lateral,
        "nasal": second.nasal,
        "release": _mergeRelease(first.release, second.release)
      }
    }

    // Invalid voicing combination
    throw new IpaSyntaxtError("Invalid voicing for affricate");
  }

  _computeAffricatePlace(firstPlace, secondPlace) {
    switch (firstPlace) {
      // Specific case for 't' + Coronal
      case "alveolar": if (Place.isCoronal(secondPlace)) return secondPlace; break;
      // Specific case for ʡ͡ħ and ʡ͡ʕ
      case "epiglottal": if (secondPlace == "pharyngeal") return secondPlace; break;
      // General case
      default: if (secondPlace == firstPlace) return secondPlace; break;
    }

    throw new IpaSyntaxtError("Invalid affricate places: '" + firstPlace + "' + '" + secondPlace + "'");
  }

  _resolveCoarticulation(first, second, manner) {
    if (!_isSameVoicing(first, second)) {
      throw new IpaSyntaxtError("Invalid voicing for coarticulation");
    }

    let lateral = first.lateral || second.lateral;
    let nasal = first.nasal || second.nasal;
    let places = first.places.concat(second.places);

    let result = {
      "manner": manner,
      "voicing": _mergeVoicing(first.voicingHelper, second.voicingHelper),
      "lateral": lateral,
      "nasal": nasal,
      "places": places,
      "release": _mergeRelease(first.release, second.release)
    };

    if (places.some(name => Place.isCoronal(name))) {
      result.coronalType = Place.mergeCoronalType(first.coronalType, second.coronalType);
    }

    return result;
  }
}