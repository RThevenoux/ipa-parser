let fs = require('fs');
let expect = require("chai").expect;
let parser = require("../src/index.js").parser;
let VowelHeight = require('../src/constants').Height;
let VowelBackness = require('../src/constants').Backness;
let VoicingHelper = require('../src/builder/voicing-helper');

function consonant(voicing, places, manner, lateral, ejective, nasal, syllabic) {
  if (typeof (places) == "string") {
    places = [places];
  }

  let segment = {
    "segment": true,
    "category": "consonant",
    "syllabic": syllabic,
    "voicing": voicing,
    "quantity": "short",
    "places": places,
    "manner": manner,
    "nasal": nasal,
    "ejective": ejective,
    "lateral": lateral,
  };

  return segment;
}

function vowel(heigh, backness, round, map, voicing, syllabic) {
  let vowel = {
    "segment": true,
    "category": "vowel",
    "syllabic": syllabic,
    "voicing": voicing,
    "quantity": "short",
    "height": heigh,
    "backness": backness,
    "rounded": round,
    "roundednessModifier": "none",
    "nasalized": false,
    "rhotacized": false,
    "tongueRoot": "neutral"
  };

  if (map) {
    for (let key in map) {
      vowel[key] = map[key];
    }
  }

  return vowel;
}

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
  let map = {};

  let voicing = new VoicingHelper(true);

  for (let i = 3; i < words.length - 1; i++) {
    switch (words[i]) {
      case "nasal": map.nasalized = true; break;
      case "syllabic": syllabic = true; break;
      case "non-syllabic": syllabic = false; break;
      case "ATR": map.tongueRoot = "advanced"; break;
      case "RTR": map.tongueRoot = "retracted"; break;
      case "less_round": map.roundednessModifier = "less"; break;
      case "more_round": map.roundednessModifier = "more"; break;
      case "rhotic": map.rhotacized = true; break;
      case "creaky-voiced": voicing.addDiacritic("Creaky voice"); break;
      case "breathy-voiced": voicing.addDiacritic("Breathy voice"); break;
      case "voiceless": ; voicing.addDiacritic("Voiceless"); break;
      case "voiced": ; voicing.addDiacritic("Voiced"); break;
      default: console.log("unsupported word " + words[i]);
    }
  }

  return vowel(height, backness, round, map, voicing.build(), syllabic);
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
      case "lateral": lateral = true; break;
      case "ejective": ejective = true; break;
      case "aspirated": voicing.addDiacritic("Aspirated"); break;
      default: places.push(word);
    }
  }
  return consonant(voicing.build(), places, manner, lateral, ejective, nasal, syllabic);
}

function _testSuite(testSuiteName, data) {
  describe(testSuiteName, () => {
    for (let key in data) {
      let description = data[key];
      let parsedDescription = [parse(description)];
      it("should parse '" + key + "' as " + description, () => {
        let units = parser.parse(key).units;
        expect(units).to.eql(parsedDescription);
      });
    }
  });
}

function testFile(fileName) {
  let data = JSON.parse(fs.readFileSync(__dirname + fileName, "utf8"))
  for (let testSuiteName in data) {
    _testSuite(testSuiteName, data[testSuiteName]);
  }
}

module.exports = {
  testFile: testFile
}