let VowelHeight = require('../src/constants').Height;
let VowelBackness = require('../src/constants').Backness;
let VoicingHelper = require('../src/builder/voicing');
let place = require('../src/builder/place');

function parse(description) {
  let words = description.toLowerCase().split(" ");
  if (words[words.length - 1] == "vowel") {
    return _parseVowel(words);
  } else {
    return _parseConsonant(words);
  }
}

function _parseVowel(words) {
  let height = VowelHeight[words[0].toUpperCase()];
  let backness = VowelBackness[words[1].toUpperCase()];
  let round = (words[2] == "round");
  let syllabic = true;
  let tongueRoot = "neutral";
  let roundednessModifier = "none";
  let nasalized = false;
  let rhotacized = false;
  let quantity = "short";

  let voicing = new VoicingHelper(true);

  for (let i = 3; i < words.length - 1; i++) {
    switch (words[i]) {
      case "nasal": nasalized = true; break;
      case "syllabic": syllabic = true; break;
      case "non-syllabic": syllabic = false; break;
      case "extra-short": quantity = "extra-short"; break;
      case "short": quantity = "short"; break;
      case "half-long": quantity = "half-long"; break;
      case "long": quantity = "long"; break;
      case "atr": tongueRoot = "advanced"; break;
      case "rtr": tongueRoot = "retracted"; break;
      case "less_round": roundednessModifier = "less"; break;
      case "more_round": roundednessModifier = "more"; break;
      case "rhotic": rhotacized = true; break;
      case "creaky-voiced": voicing.addDiacritic("Creaky voice"); break;
      case "breathy-voiced": voicing.addDiacritic("Breathy voice"); break;
      case "voiceless": voicing.addDiacritic("Voiceless"); break;
      case "voiced": voicing.addDiacritic("Voiced"); break;
      default: throw new Error("Unsupported vowel modifier word: '" + words[i] + "'");
    }
  }

  return {
    "segment": true,
    "category": "vowel",
    "syllabic": syllabic,
    "voicing": voicing.build(),
    "quantity": quantity,
    "height": height,
    "backness": backness,
    "rounded": round,
    "roundednessModifier": roundednessModifier,
    "nasalized": nasalized,
    "rhotacized": rhotacized,
    "tongueRoot": tongueRoot
  };
}

function _parseVoicing(word) {
  switch (word) {
    case "voiceless": return new VoicingHelper(false);
    case "voiced": return new VoicingHelper(true);
    case "creaky-voiced": {
      let voicing = new VoicingHelper(true);
      voicing.addDiacritic("Creaky voice");
      return voicing;
    }
    case "breathy-voiced": {
      let voicing = new VoicingHelper(true);
      voicing.addDiacritic("Breathy voice");
      return voicing;
    };
    default: throw new Error("Unsupported voicing word: '" + word + "'");
  }
}

function _parseConsonant(words) {
  let places = [];
  let coronalType = "unspecified";
  let lateral = false;
  let ejective = false;
  let nasal = false;
  let syllabic = false;
  let quantity = "short";
  let release = "unaspirated";
  let secondary = "none";

  let manner = words[words.length - 1];
  if (manner == "nasal") {
    manner = "plosive";
    nasal = true;
  }

  let voicing = _parseVoicing(words[0]);
  for (let i = 1; i < words.length - 1; i++) {
    let word = words[i];
    switch (word) {
      // 
      case "nasal": nasal = true; break;
      case "lateral": lateral = true; break;
      case "ejective": ejective = true; break;
      // Syllabic
      case "syllabic": syllabic = true; break;
      case "non-syllabic": syllabic = false; break;
      // Quantity
      case "extra-short": quantity = "extra-short"; break;
      case "short": quantity = "short"; break;
      case "half-long": quantity = "half-long"; break;
      case "long": //fallthrough
      case "geminate": quantity = "long"; break;
      // Aspirated
      case "aspirated": release = "aspirated"; break;
      case "unaspirated": release = "unaspirated"; break;
      // Release
      case "nasal-release": release = "nasal-release"; break;
      case "lateral-release": release = "lateral-release"; break;
      case "no-audible-release": release = "no-audible-release"; break;
      // Coronal Type
      case "laminal": coronalType = "laminal"; break;
      case "apical": coronalType = "apical"; break;
      // Secondary articulation
      case "labialized": secondary = "bilabial"; break;
      case "palatalized": secondary = "palatal"; break;
      case "velarized": secondary = "velar"; break;
      // case "uvularized": secondary = "uvular"; break; NOTA: Uvularization is not defined in IPA-chart. But 'ʶ' (upperscript reversed-R) could be used 
      case "pharyngealized": secondary = "pharyngeal"; break;
      // Place
      default: places.push(word);
    }
  }

  let unit = {
    "segment": true,
    "category": "consonant",
    "syllabic": syllabic,
    "voicing": voicing.build(),
    "quantity": quantity,
    "places": places,
    "manner": manner,
    "secondary": secondary,
    "nasal": nasal,
    "ejective": ejective,
    "lateral": lateral,
    "release": release
  };

  let isCoronal = places.some(name => place.isCoronal(name));
  if (isCoronal) {
    unit.coronalType = coronalType;
  }

  return unit;
}

module.exports = {
  parse: parse
}