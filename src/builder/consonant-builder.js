const SegmentHelper = require("./segment-helper");
const Articulation = require("./articulation");
const Place = require("./place");
const IpaSyntaxtError = require("../error/ipa-syntax-error");
const Voicing = require("./voicing");
const Affricate = require("./affricate");
const Backness = require("../constants").Backness;

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
      case "phonation": this._getCurrentArticulations().forEach(articulation => articulation.updatePhonation(diacritic.label)); break;
      case "articulation": this._getCurrentArticulations().forEach(articulation => articulation.updateArticulation(diacritic.label)); break;
      case "release": this._updateRelease(diacritic.label); break;
      case "co-articulation":
        switch (diacritic.label) {
          case "Nasalized": this._getCurrentArticulations().forEach(articulation => articulation.nasalized()); break;
          case "Labialized": this.secondary = "bilabial"; break;
          case "Palatalized": this.secondary = "palatal"; break;
          case "Velarized": this.secondary = "velar"; break;
          case "Velarized or pharyngealized": this.secondary = "velar"; break;
          case "Pharyngealized": this.secondary = "pharyngeal"; break;
          case "Labio-palatalized": throw new IpaSyntaxtError("Labio-palatization not supported");
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
    this._addArticulations(second);
    this.state = "double-char";
  }

  _addArticulations(consonantDef) {
    this.currentArticulationsLegnth = consonantDef.places.length;
    for (let placeIndex = 0; placeIndex < consonantDef.places.length; placeIndex++) {
      this.articulations.push(new Articulation(consonantDef, placeIndex));
    }
  }

  _getCurrentArticulations() {
    let index = this.articulations.length - this.currentArticulationsLegnth;
    return this.articulations.slice(index);
  }

  _updateRelease(label) {
    switch (label) {
      case "Aspirated": this.release = "aspirated"; break;
      case "Nasal": this.release = "nasal-release"; break;
      case "No audible": this.release = "no-audible-release"; break;
      case "Lateral": this.release = "lateral-release"; break;
    }
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
      data.secondary = this.secondary;
      data.release = this.release;
      return this.segmentHelper.buildConsonant(data);
    }
  }

  _buildVowel(data) {
    // see : https://en.wikipedia.org/wiki/Approximant_consonant#Semivowels

    // If two place, the first should be bilabial
    // The last place should defined the backness
    //  - palatal => Front vowel
    //  - velar => Back vowel
    let backness;
    let backnessPlace = data.places[data.places.length - 1];
    switch (backnessPlace) {
      case "palatal": backness = Backness["FRONT"]; break;
      case "velar": backness = Backness["BACK"]; break;
      default: throw new IpaSyntaxtError("Unsupported place for lowered approximant : " + backnessPlace);
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
      return this._resolveSingleArticulation(first);
    }

    // If two articulations
    let second = this.articulations[1];
    if (first.manner === second.manner) {
      return this._resolveCoarticulation(first, second, first.manner);
    }
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
    let result = {
      "voicing": articulation.voicing.build(),
      "places": [articulation.place],
      "manner": articulation.manner,
      "lateral": articulation.lateral,
      "nasal": articulation.nasal
    }

    if (Place.isCoronal(articulation.place)) {
      result.coronalType = articulation.coronalType;
    }

    return result;
  }

  _resolveAffricate(first, second) {
    let affricatePlace = Affricate.computeAffricatePlace(first, second);
    let voicing = Affricate.computeAffricateVoicing(first, second);

    let result = {
      "voicing": voicing,
      "places": [affricatePlace],
      "manner": "affricate",
      "lateral": second.lateral,
      "nasal": second.nasal
    }

    if (Place.isCoronal(affricatePlace)) {
      result.coronalType = Place.mergeCoronalType(first.coronalType, second.coronalType);
    }

    return result;
  }

  _resolveCoarticulation(first, second, manner) {
    if (first.isVoiced() != second.isVoiced()) {
      throw new IpaSyntaxtError("Invalid voicing for coarticulation");
    }

    let lateral = first.lateral || second.lateral;
    let nasal = first.nasal || second.nasal;
    let places = [first.place, second.place];

    let result = {
      "voicing": Voicing.merge(first.voicing, second.voicing),
      "places": places,
      "manner": manner,
      "lateral": lateral,
      "nasal": nasal
    };

    if (places.some(name => Place.isCoronal(name))) {
      result.coronalType = Place.mergeCoronalType(first.coronalType, second.coronalType);
    }

    return result;
  }

  _adhocRetroflexTrill(first, second) {
    if (first.place != "retroflex" || second.place != "alveolar") {
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