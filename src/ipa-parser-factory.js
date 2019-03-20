var Mapper = require("./mapper");
var VowelHeight = require("./constants").Height;
var VowelBackness = require("./constants").Backness;
var IpaParser = require("./ipa-parser");

module.exports = class IpaParserFactory {
  get() {
    // -- Normalization
    var alternatives = require("./data/alternatives.json");
    let normalization = {};
    for (let key in alternatives) {
      normalization[key] = alternatives[key].target;
    }

    // -- Symbol mapping
    let mapper = new Mapper();

    // Diacritics
    let diacritics = require("./data/diacritics.json");
    for (let type in diacritics) {
      let typeBundle = diacritics[type];
      for (let key in typeBundle) {
        let diacritic = typeBundle[key];
        mapper.addDiacritic(key, type, diacritic.ipa);
      }
    }

    // Vowels
    let vowels = require("./data/vowels.json");
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
    let consonants = require("./data/consonants.json");
    // Combining
    consonants.combining.forEach(key => mapper.addTieBar(key));
    consonants.ejective.forEach(key =>
      mapper.addDiacritic(key, "ejective", "ejective")
    );

    for (let mannerName in consonants.symbol) {
      let mannerBundle = consonants.symbol[mannerName];
      for (let key in mannerBundle) {
        let consonant = mannerBundle[key];
        let lateral = consonant.lateral ? true : false;
        let places = consonant.place;
        let nasal = false;
        let manner = mannerName;

        if (mannerName == "nasal") {
          manner = "plosive";
          nasal = true;
        }

        if (typeof places == "string") {
          places = [places];
        }

        mapper.addConsonant(
          key,
          manner,
          places,
          consonant.voiced,
          lateral,
          nasal
        );
      }
    }

    // Brackets
    let brackets = require("./data/brackets.json");
    brackets.forEach(info =>
      mapper.addBrackets(info.type, info.start, info.end)
    );

    // Supra
    let supra = require("./data/supra.json");
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
};
