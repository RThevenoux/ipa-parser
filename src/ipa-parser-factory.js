var fs = require('fs');
var Mapper = require('./mapper');
var VowelHeight = require('./phoneme/vowel-phoneme').Height;
var VowelBackness = require('./phoneme/vowel-phoneme').Backness;
var IpaParser = require('./ipa-parser');

module.exports = class IpaParserFactory {
  get() {
    // -- Normalization
    var miscellaneous = JSON.parse(fs.readFileSync(__dirname + "/data/miscellaneous.json", "utf8"));
    let normalization = {};
    for (let key in miscellaneous.normalization) {
      normalization[key] = miscellaneous.normalization[key].target;
    }

    // -- Symbol mapping
    let mapper = new Mapper();

    // Combining
    miscellaneous.combining.forEach(key => mapper.addCombining(key));

    // Diacritics
    // TODO some prosody symbol separate phoneme and do not decorate them
    let diacritics = JSON.parse(fs.readFileSync(__dirname + "/data/diacritics.json", "utf8"));
    for (let type in diacritics) {
      let typeBundle = diacritics[type];
      for (let key in typeBundle) {
        let diacritic = typeBundle[key];
        mapper.addDiacritic(key, diacritic.ipa, type);
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
    for (let manner in consonants) {
      let mannerBundle = consonants[manner];
      for (let key in mannerBundle) {
        let consonant = mannerBundle[key];
        let lateral = (consonant.lateral ? true : false);
        mapper.addConsonant(key, manner, consonant.place, consonant.voiced, lateral);
      }
    }

    // Brackets
    let brackets = JSON.parse(fs.readFileSync(__dirname + "/data/brackets.json", "utf8"));
    brackets.forEach(info => mapper.addBrackets(info.type, info.start, info.end));

    // Supra
    let supra = JSON.parse(fs.readFileSync(__dirname + "/data/supra.json", "utf8"));
    for (let supraType in supra) {
      let bundle = supra[supraType];
      for (let key in bundle) {
        mapper.addSupra(key, supraType, bundle[key]);
      }
    }

    return new IpaParser(mapper, normalization);
  }
}