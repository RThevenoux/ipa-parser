const IpaParserFactory = require("./ipa-parser-factory");
const height = require("./constants").Height;
const backness = require("./constants").Backness;

module.exports = {
  parser: new IpaParserFactory().get(),
  height,
  backness
}