var expect = require("chai").expect;
var parser = require("../src/index.js").parser;
var IpaSyntaxError = require("../src/error/ipa-syntax-error.js");

let testData = {
  "": "none",
  "a": "none",
  "/a/": "phonemic",
  "[a]": "phonetic"
};
let failData = {
  "data outside of the brackets": ["a[a]", "[a]a", "a[a]a"],
  "a bracket is not paired": ["[a", "]a", "a[", "a]"],
  "opening and closing bracket are not matching": ["[a/", "/a]"],
  "there is more than 2 brackets": ["[a]]", "[[a]", "[[a]]", "[a]a]", "[a[a]", "[a[a]a]"]
}

describe('ipa-parser : bracket', () => {
  describe('valid brackets', () => {
    for (let key in testData) {
      let type = testData[key];
      it("should parse '" + key + "' with type '" + type + "'", () => {
        expect(parser.parse(key)).to.have.property('type', type);
      });
    }
  });

  describe('invalid brackets', () => {
    for (let label in failData) {
      it("should fail if " + label, () => {
        failData[label].forEach(testCase =>
          expect(() => parser.parse(testCase)).to.throw(IpaSyntaxError)
        );
      });
    }
  });
});