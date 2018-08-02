var fs = require('fs');
var IpaSymbol = require('./ipa-symbol');
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
    let mapping = {};

    // Combining
    miscellaneous.combining.forEach(key => mapping[key] = IpaSymbol.combining(key));

    // Diacritics
    // TODO some prosody symbol separate phoneme and do not decorate them
    let diacritics = JSON.parse(fs.readFileSync(__dirname + "/data/diacritics.json", "utf8"));
    for (let type in diacritics) {
      let typeBundle = diacritics[type];
      for (let key in typeBundle) {
        let diacritic = typeBundle[key];
        mapping[key] = IpaSymbol.diacritic(key, diacritic.ipa, type);
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
          mapping[unroundedVowel] = IpaSymbol.vowel(unroundedVowel, height, backness, false);
        }
        let roundedVowel = couple[1];
        if (roundedVowel) {
          mapping[roundedVowel] = IpaSymbol.vowel(roundedVowel, height, backness, true);
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
        mapping[key] = IpaSymbol.consonant(key, manner, consonant.place, consonant.voiced, lateral);
      }
    }

    return new IpaParser(mapping, normalization);
  }
}