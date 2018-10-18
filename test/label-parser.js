let VowelHeight = require('../src/constants').Height;
let VowelBackness = require('../src/constants').Backness;
let VoicingHelper = require('../src/builder/voicing-helper');

function parse(description) {
  let words = description.split(" ");
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
      case "ATR": tongueRoot = "advanced"; break;
      case "RTR": tongueRoot = "retracted"; break;
      case "less_round": roundednessModifier = "less"; break;
      case "more_round": roundednessModifier = "more"; break;
      case "rhotic": rhotacized = true; break;
      case "creaky-voiced": voicing.addDiacritic("Creaky voice"); break;
      case "breathy-voiced": voicing.addDiacritic("Breathy voice"); break;
      case "voiceless": ; voicing.addDiacritic("Voiceless"); break;
      case "voiced": ; voicing.addDiacritic("Voiced"); break;
      default: console.log("unsupported word " + words[i]);
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
    default: console.log("unsupported word " + words[i]);
  }
}

function _parseConsonant(words) {
  let places = [];
  let lateral = false;
  let ejective = false;
  let nasal = false;
  let syllabic = false;
  let quantity = "short";

  let manner = words[words.length - 1];
  if (manner == "nasal") {
    manner = "plosive";
    nasal = true;
  }

  let voicing = _parseVoicing(words[0]);
  for (let i = 1; i < words.length - 1; i++) {
    let word = words[i];
    switch (word) {
      case "nasal": nasal = true; break;
      case "syllabic": syllabic = true; break;
      case "non-syllabic": syllabic = false; break;
      case "extra-short": quantity = "extra-short"; break;
      case "short": quantity = "short"; break;
      case "half-long": quantity = "half-long"; break;
      case "long": //fallthrough
      case "geminate": quantity = "long"; break;
      case "lateral": lateral = true; break;
      case "ejective": ejective = true; break;
      case "aspirated": voicing.addDiacritic("Aspirated"); break;
      default: places.push(word);
    }
  }

  return {
    "segment": true,
    "category": "consonant",
    "syllabic": syllabic,
    "voicing": voicing.build(),
    "quantity": quantity,
    "places": places,
    "manner": manner,
    "nasal": nasal,
    "ejective": ejective,
    "lateral": lateral,
  };
}

module.exports = {
  parse: parse
}