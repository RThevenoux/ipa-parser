var fs = require('fs');
var Mapper = require('./mapper');
var VowelHeight = require('./constants').Height;
var VowelBackness = require('./constants').Backness;
var IpaParser = require('./ipa-parser');

module.exports = class IpaParserFactory {
  get() {
    // -- Normalization
    var alternatives = JSON.parse(fs.readFileSync(__dirname + "/data/alternatives.json", "utf8"));
    let normalization = {};
    for (let key in alternatives) {
      normalization[key] = alternatives[key].target;
    }

    // -- Symbol mapping
    let mapper = new Mapper();

    // Diacritics
    let diacritics = JSON.parse(fs.readFileSync(__dirname + "/data/diacritics.json", "utf8"));
    for (let type in diacritics) {
      let typeBundle = diacritics[type];
      for (let key in typeBundle) {
        let diacritic = typeBundle[key];
        mapper.addDiacritic(key, type, diacritic.ipa);
      }
    }

    // Vowels
    let vowels = JSON.parse(fs.readFileSync(__dirname + "/data/vowels.json", "utf8"));
    for (let heightLabel in vowels) {
      let heightBundle = vowels[heightLabel];
      for (let backnessLabel in heightBundle) {
        let couple = heightBundle[backnessLabel];

        let height = VowelHeight[heightLabel];
        let backness = VowelBackness[backnessLabel];

        let unroundedVowel = couple[0];
        if (unroundedVowel) {
          mapper.addVowel(unroundedVowel, height, backness, false);
        }
        let roundedVowel = couple[1];
        if (roundedVowel) {
          mapper.addVowel(roundedVowel, height, backness, true);
        }
      }
    }

    // Consonants
    let consonants = JSON.parse(fs.readFileSync(__dirname + "/data/consonants.json", "utf8"));
    // Combining
    consonants.combining.forEach(key => mapper.addTieBar(key));
    consonants.ejective.forEach(key => mapper.addDiacritic(key, "ejective", "ejective"));

    for (let manner in consonants.symbol) {
      let mannerBundle = consonants.symbol[manner];
      for (let key in mannerBundle) {
        let consonant = mannerBundle[key];
        let lateral = (consonant.lateral ? true : false);
        let places = consonant.place;
        if (typeof (places) == "string") {
          places = [places];
        }

        mapper.addConsonant(key, manner, places, consonant.voiced, lateral);
      }
    }

    // Brackets
    let brackets = JSON.parse(fs.readFileSync(__dirname + "/data/brackets.json", "utf8"));
    brackets.forEach(info => mapper.addBrackets(info.type, info.start, info.end));

    // Supra
    let supra = JSON.parse(fs.readFileSync(__dirname + "/data/supra.json", "utf8"));
    for (let type in supra["diacritic"]) {
      let bundle = supra["diacritic"][type];
      for (let key in bundle) {
        mapper.addDiacritic(key, type, bundle[key]);
      }
    }
    for (let key in supra["tone-letter"]) {
      mapper.addToneLetter(key, supra["tone-letter"][key]);
    }
    for (let supraType in supra["single-char"]) {
      let bundle = supra["single-char"][supraType];
      for (let key in bundle) {
        mapper.addSupra(key, supraType, bundle[key]);
      }
    }
    return new IpaParser(mapper, normalization);
  }
}