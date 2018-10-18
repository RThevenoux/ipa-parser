let fs = require('fs');
let expect = require("chai").expect;
let ipaParser = require("../src/index.js").parser;
let labelParser = require('./label-parser');

function _testSuite(testSuiteName, data) {
  describe(testSuiteName, () => {
    for (let key in data) {
      let description = data[key];
      let parsedDescription = [labelParser.parse(description)];
      it("should parse '" + key + "' as " + description, () => {
        let units = ipaParser.parse(key).units;
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

describe("ipa-parser : characters and diacritics", () => {
  testFile("/data/consonant.json");
  testFile("/data/edge-case.json");
  testFile("/data/vowel.json");
});
