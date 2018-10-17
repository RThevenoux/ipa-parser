let helper = require('./helper');
let expect = require("chai").expect;
let parser = require("../src/index.js").parser;

function expectUnitsOf(string) {
  return expect(parser.parse(string).units);
}

function testData(label, data) {
  describe(label, () => {
    for (let key in data) {
      let description = data[key];
      let parsedDescription = [helper.parse(description)];
      it("should parse '" + key + "' as " + description, () => {
        expectUnitsOf(key).to.eql(parsedDescription);
      });
    }
  });
}

let data = helper.loadJson("/edge-case.json");
describe("ipa-parser : edge case", () => {
  testData("lowered approximant", data["lowered approximant"]);
});