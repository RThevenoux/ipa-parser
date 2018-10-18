var expect = require("chai").expect;

var parser = require("../src/index.js").parser;
var IpaCharacterError = require("../src/error/ipa-character-error.js");

function _itShouldThrowTypeErrorIf(label, arg) {
  it("should throw TypeError if " + label, () => {
    expect(() => parser.parse(arg)).to.throw(TypeError);
  });
}

describe('ipa-parser : invalid input', () => {

  describe('Invalid string', () => {
    it("should throw IpaCharacterError if not IPA character", () => {
      expect(() => parser.parse("€")).to.throw(IpaCharacterError);
      expect(() => parser.parse("#")).to.throw(IpaCharacterError);
      expect(() => parser.parse("7")).to.throw(IpaCharacterError);
    });
  });

  describe('Invalid argument type', () => {
    _itShouldThrowTypeErrorIf("no argument");
    _itShouldThrowTypeErrorIf("first argument is null", null);
    _itShouldThrowTypeErrorIf("first argument is undefined", undefined);
    _itShouldThrowTypeErrorIf("first argument is array", ["a"]);
    _itShouldThrowTypeErrorIf("first argument is object", { "ipa": "a" });
    _itShouldThrowTypeErrorIf("first argument is a function", () => "a");
    _itShouldThrowTypeErrorIf("first argument is a number", 42);
    _itShouldThrowTypeErrorIf("first argument is a regex", /a/);
    _itShouldThrowTypeErrorIf("first argument is a boolean", true);
  });
});