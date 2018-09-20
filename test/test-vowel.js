var expect = require("chai").expect;

var ipaParser = require("../src/index.js");
var IpaCharacterError = require("../src/error/ipa-character-error");
var IpaSyntaxError = require("../src/error/ipa-syntax-error");

var parser = ipaParser.parser;

function expectUnitsOf(string) {
  return expect(parser.parse(string).units);
}

function vowel(heigh, backness, round) {
  return {
    "segment": true,
    "category": "vowel",
    "syllabic": true,
    "voiced": true,
    "quantity": "short",
    "height": heigh,
    "backness": backness,
    "rounded": round,
    "nasalized": false
  };
}

describe("ipa-parser : vowel", () => {
  it("should parse every vowel without diacritic", () => {
    expectUnitsOf("i").to.eql([vowel(3, 2, false)]);
    expectUnitsOf("y").to.eql([vowel(3, 2, true)]);
    expectUnitsOf("ɨ").to.eql([vowel(3, 0, false)]);
    expectUnitsOf("ʉ").to.eql([vowel(3, 0, true)]);
    expectUnitsOf("ɯ").to.eql([vowel(3, -2, false)]);
    expectUnitsOf("u").to.eql([vowel(3, -2, true)]);
    expectUnitsOf("ɪ").to.eql([vowel(2, 1, false)]);
    expectUnitsOf("ʏ").to.eql([vowel(2, 1, true)]);
    expectUnitsOf("ʊ").to.eql([vowel(2, -1, true)]);
    expectUnitsOf("e").to.eql([vowel(1, 2, false)]);
    expectUnitsOf("ø").to.eql([vowel(1, 2, true)]);
    expectUnitsOf("ɘ").to.eql([vowel(1, 0, false)]);
    expectUnitsOf("ɵ").to.eql([vowel(1, 0, true)]);
    expectUnitsOf("ɤ").to.eql([vowel(1, -2, false)]);
    expectUnitsOf("o").to.eql([vowel(1, -2, true)]);
    expectUnitsOf("ə").to.eql([vowel(0, 0, false)]);
    expectUnitsOf("ɛ").to.eql([vowel(-1, 2, false)]);
    expectUnitsOf("œ").to.eql([vowel(-1, 2, true)]);
    expectUnitsOf("ɜ").to.eql([vowel(-1, 0, false)]);
    expectUnitsOf("ɞ").to.eql([vowel(-1, 0, true)]);
    expectUnitsOf("ʌ").to.eql([vowel(-1, -2, false)]);
    expectUnitsOf("ɔ").to.eql([vowel(-1, -2, true)]);
    expectUnitsOf("æ").to.eql([vowel(-2, 2, false)]);
    expectUnitsOf("ɐ").to.eql([vowel(-2, 0, false)]);
    expectUnitsOf("a").to.eql([vowel(-3, 2, false)]);
    expectUnitsOf("ɶ").to.eql([vowel(-3, 2, true)]);
    expectUnitsOf("ɑ").to.eql([vowel(-3, -2, false)]);
    expectUnitsOf("ɒ").to.eql([vowel(-3, -2, true)]);
  });
});