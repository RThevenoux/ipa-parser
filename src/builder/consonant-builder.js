const SegmentHelper = require("./segment-helper");
const Articulation = require("./articulation");
const Place = require("./place");
const Voicing = require("./voicing");
const Affricate = require("./affricate");
const IpaSyntaxtError = require("../error/ipa-syntax-error");
const IpaInternError = require("../error/ipa-internal-error");

module.exports = class ConsonantBuilder {
  constructor(consonantDef) {
    this.state = "single-char";

    this.segmentHelper = new SegmentHelper();
    this.ejective = false;
    this.release = "unaspirated";
    this.secondary = "none";
    this.articulations = [];

    this._addArticulations(consonantDef);
  }

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.segmentHelper.addTone(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
      case "syllabicity": this.segmentHelper.updateSyllabicity(diacritic.label); break;
      case "ejective": this.ejective = true; break;
      case "release": this._updateRelease(diacritic.label); break;
      case "secondary-articulation": this._updateSecondaryArticulation(diacritic.label); break;
      case "phonation": this._getCurrentArticulations().forEach(articulation => articulation.updatePhonation(diacritic.label)); break;
      case "articulation": this._getCurrentArticulations().forEach(articulation => articulation.updateArticulation(diacritic.label)); break;
      case "nasalized": this._getCurrentArticulations().forEach(articulation => articulation.nasalized()); break;
      case "roundedness":  /*TODO?*/ break;
      case "tongue-root": //fallthroug
      case "rhotacized": throw new IpaSyntaxtError("'" + diacritic.label + "' diacritic is not supported by consonant");
      default: throw new IpaInternError("Unsupported diacritic type: '" + diacritic.type + "'");
    }
  }

  addTieBar() {
    if (this.state != "single-char") throw new IpaSyntaxtError("Unexpected tie-bar. State=" + this.state);
    this.state = "expecting";
  }

  isExpectingConsonant() {
    return this.state === "expecting";
  }

  addConsonant(second) {
    if (!this.isExpectingConsonant()) throw new IpaSyntaxtError("Unexpected second articulation. State=" + this.state);

    this._addArticulations(second);
    this.state = "double-char";
  }

  _addArticulations(consonantDef) {
    if (this.articulations.length + consonantDef.places.length > 2) throw new IpaSyntaxtError("Can not manage more than 2 articulations for one consonant.");

    this.currentArticulationsLegnth = consonantDef.places.length;
    for (let placeIndex = 0; placeIndex < consonantDef.places.length; placeIndex++) {
      this.articulations.push(new Articulation(consonantDef, placeIndex));
    }
  }

  _getCurrentArticulations() {
    let index = this.articulations.length - this.currentArticulationsLegnth;
    return this.articulations.slice(index);
  }

  _updateSecondaryArticulation(label) {
    switch (label) {
      case "Labialized": this.secondary = "bilabial"; break;
      case "Palatalized": this.secondary = "palatal"; break;
      case "Velarized": this.secondary = "velar"; break;
      case "Velarized or pharyngealized": this.secondary = "velar"; break;
      case "Pharyngealized": this.secondary = "pharyngeal"; break;
      case "Labio-palatalized": throw new IpaSyntaxtError("Labio-palatization not supported");
      default: throw new IpaInternError("Unsupported secondary-articulation label: '" + label + "'");
    }
  }

  _updateRelease(label) {
    switch (label) {
      case "Aspirated": this.release = "aspirated"; break;
      case "Nasal": this.release = "nasal-release"; break;
      case "No audible": this.release = "no-audible-release"; break;
      case "Lateral": this.release = "lateral-release"; break;
      default: throw new IpaInternError("Unsupported release label: '" + label + "'");
    }
  }

  end() {
    if (this.isExpectingConsonant()) throw new IpaSyntaxtError("Unexpected end of consonant. Expected second articulation. State=" + this.state);

    let data = this._resolveArticulations();
    data.places = Place.orderPlaces(data.places);

    if (data.manner == "vowel") {
      return this._buildVowel(data);
    } else {
      data.ejective = this.ejective;
      data.secondary = this.secondary;
      data.release = this.release;
      if (!data.places.some(Place.isCoronal)) {
        delete data.coronalType;
      }

      return this.segmentHelper.buildConsonant(data);
    }
  }

  _buildVowel(data) {
    // see : https://en.wikipedia.org/wiki/Approximant_consonant#Semivowels
    let placeInfo = Place.approximantToVowel(data.places);
    let values = {
      "voicing": data.voicing,
      "height": placeInfo.height,
      "backness": placeInfo.backness,
      "rounded": placeInfo.rounded,
      "roundednessModifier": "none",
      "nasalized": data.nasal,
      "rhotacized": false,
      "tongueRoot": "neutral"
    };
    return this.segmentHelper.buildVowel(values);
  }

  _resolveArticulations() {
    if (this.articulations.length == 1) {
      return this._resolveSingleArticulation(this.articulations[0]);
    }

    // If two articulations
    let first = this.articulations[0];
    let second = this.articulations[1];
    if (first.manner == second.manner) {
      return this._resolveCoarticulation(first, second, first.manner);
    }
    // If two articulation with differents manners
    switch (first.manner) {
      case "plosive": {
        switch (second.manner) {
          case "fricative": return this._resolveAffricate(first, second);
          case "implosive": return this._resolveCoarticulation(first, second, "implosive");
        }
      } break;
      case "flap": {
        // Ad-hoc case for retroflex trill 'ɽ͡r' & 'ɽ͡r̥' & ...
        if (second.manner == "trill") {
          return this._adhocRetroflexTrill(first, second);
        }
      }
    }
    // If do not match a valid combinaison
    throw new IpaSyntaxtError("Invalid articulations manner: '" + first.manner + "' + '" + second.manner + "'");
  }

  _resolveSingleArticulation(articulation) {
    return {
      "voicing": articulation.voicing.build(),
      "places": [articulation.place],
      "coronalType": articulation.coronalType,
      "manner": articulation.manner,
      "lateral": articulation.lateral,
      "nasal": articulation.nasal
    }
  }

  _resolveAffricate(first, second) {
    let affricatePlace = Affricate.computeAffricatePlace(first, second);
    let voicing = Affricate.computeAffricateVoicing(first, second);

    return {
      "voicing": voicing,
      "places": [affricatePlace],
      "coronalType": Place.mergeCoronalType(first.coronalType, second.coronalType),
      "manner": "affricate",
      "lateral": second.lateral,
      "nasal": second.nasal
    }
  }

  _resolveCoarticulation(first, second, manner) {
    if (first.isVoiced() != second.isVoiced()) throw new IpaSyntaxtError("Invalid voicing for coarticulation")

    return {
      "voicing": Voicing.merge(first.voicing, second.voicing),
      "places": [first.place, second.place],
      "coronalType": Place.mergeCoronalType(first.coronalType, second.coronalType),
      "manner": manner,
      "lateral": first.lateral || second.lateral,
      "nasal": first.nasal || second.nasal
    };
  }

  _adhocRetroflexTrill(first, second) {
    if (!(first.place == "retroflex" && second.place == "alveolar")) {
      throw new IpaSyntaxtError("Invalid place for the ad-hoc retroflex trill: '" + first.place + "' + '" + second.place + "'");
    }

    return {
      "voicing": second.voicing.build(),
      "places": ["retroflex"],
      "coronalType": first.coronalType,
      "manner": "trill",
      "lateral": false,
      "nasal": second.nasal
    }
  }
}