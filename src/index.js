const IpaParserFactory = require("./ipa-parser-factory");
const height = require("./phoneme/vowel-phoneme").Height;
const backness = require("./phoneme/vowel-phoneme").Backness;

module.exports = {
  parser: new IpaParserFactory().get(),
  height,
  backness
}