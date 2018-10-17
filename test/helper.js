let fs = require('fs');
let expect = require("chai").expect;
let parser = require("../src/index.js").parser;
var VowelHeight = require('../src/constants').Height;
var VowelBackness = require('../src/constants').Backness;

function consonant(voiced, places, manner, lateral, ejective, nasal) {
  if (typeof (places) == "string") {
    places = [places];
  }

  let segment = {
    "segment": true,
    "category": "consonant",
    "syllabic": false,
    "voicing": {
      "voiced": voiced,
      "phonation": (voiced ? "modal" : "voiceless"), // breathy, creaky
      "aspirated": false
    },
    "quantity": "short",
    "places": places,
    "manner": manner,
    "nasal": nasal,
    "ejective": (ejective ? true : false),
    "lateral": (lateral ? true : false),
  };

  return segment;
}

function vowel(heigh, backness, round, map) {
  let vowel = {
    "segment": true,
    "category": "vowel",
    "syllabic": true,
    "voicing": {
      "voiced": true,
      "phonation": "modal",
      "aspirated": false
    },
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

function _isVoiced(word) {
  return word == "voiced";
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
  let map = {};

  for (let i = 3; i < words.length - 1; i++) {
    switch (words[i]) {
      case "nasal": map.nasalized = true; break;
      case "ATR": map.tongueRoot = "advanced"; break;
      case "RTR": map.tongueRoot = "retracted"; break;
      case "less_round": map.roundednessModifier = "less"; break;
      case "more_round": map.roundednessModifier = "more"; break;
      case "rhotic": map.rhotacized = true; break;
      default: console.log("unsupported word " + words[i]);
    }
  }

  return vowel(height, backness, round, map);
}

function _parseConsonant(words) {
  let places = [];
  let lateral = false;
  let ejective = false;

  let manner = words[words.length - 1];

  let nasal = false;
  if (manner == "nasal") {
    manner = "plosive";
    nasal = true;
  }

  let voiced = _isVoiced(words[0]);
  for (let i = 1; i < words.length - 1; i++) {
    let word = words[i];
    switch (word) {
      case "lateral": lateral = true; break;
      case "ejective": ejective = true; break;
      case "nasal": nasal = true; break;
      default: places.push(word);
    }
  }
  return consonant(voiced, places, manner, lateral, ejective, nasal);
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