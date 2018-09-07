var expect = require("chai").expect;

var ipaParser = require("../src/index.js");
var IpaCharacterError = require("../src/error/ipa-character-error");
var IpaSyntaxError = require("../src/error/ipa-syntax-error");

var parser = ipaParser.parser;

function expectUnitsOf(string) {
  return expect(parser.parse(string).units);
}

describe('ipa-parser', () => {

  describe('transcription type', () => {
    it("should be 'none' if there is no bracket", () => {
      expect(parser.parse("")).to.have.property('type', 'none');
      expect(parser.parse("a")).to.have.property('type', 'none');
    });
    it("should be 'phonemic' if there is // brackets", () => {
      expect(parser.parse("/a/")).to.have.property('type', 'phonemic');
    });
    it("should be 'phonetic' if there is [] brackets", () => {
      expect(parser.parse("[a]")).to.have.property('type', 'phonetic');
    });

    it("should fail if data outside of the brackets", () => {
      expect(() => parser.parse("a[a]")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("[a]a")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("a[a]a")).to.throw(IpaSyntaxError);
    });
    it("should fail if a bracket is not paired", () => {
      expect(() => parser.parse("[a")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("]a")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("a[")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("a]")).to.throw(IpaSyntaxError);
    });
    it("should fail if opening and closing bracket are not matching", () => {
      expect(() => parser.parse("[a/")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("/a]")).to.throw(IpaSyntaxError);
    });
    it("should fail if there is more than 2 brackets", () => {
      expect(() => parser.parse("[a]]")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("[[a]")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("[[a]]")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("[a]a]")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("[a[a]")).to.throw(IpaSyntaxError);
      expect(() => parser.parse("[a[a]a]")).to.throw(IpaSyntaxError);
    });
  });

  describe('stress', () => {
    let primary = { "segment": false, "category": "stress", "value": "primary" };
    let secondary = { "segment": false, "category": "stress", "value": "secondary" };

    // Warning primary stress used \u02C8 and not apostrophe \u0027
    it("should a single high vertical line be parsed as one primary stress", () => {
      expectUnitsOf("ˈ").to.eql([primary]);
    });
    it("should a single low vertical line be parsed as one secondary stress", () => {
      expectUnitsOf("ˌ").to.eql([secondary]);
    });
    it("should parse a two high vertical line separate as two primary stress", () => {
      expectUnitsOf("ˈˈ").to.eql([primary, primary]);
      expectUnitsOf("ˈˌ").to.eql([primary, secondary]);
      expectUnitsOf("ˌˌ").to.eql([secondary, secondary]);
      expectUnitsOf("ˈ ˈ").to.eql([primary, primary]);
    });
  });

  describe('invalid string', () => {
    it("should throw exception if not IPA character", () => {
      expect(() => parser.parse("€")).to.throw(IpaCharacterError);
      expect(() => parser.parse("#")).to.throw(IpaCharacterError);
      expect(() => parser.parse("7")).to.throw(IpaCharacterError);
    });
  });

  describe('invalid argument type', () => {
    it("should throw exception if no argument", () => {
      expect(() => parser.parse()).to.throw(TypeError);
    });
    it("should throw exception if first argument is null", () => {
      expect(() => parser.parse(null)).to.throw(TypeError);
    });
    it("should throw exception if first argument is undefined", () => {
      expect(() => parser.parse(undefined)).to.throw(TypeError);
    });
    it("should throw exception if first argument is array", () => {
      expect(() => parser.parse(["a"])).to.throw(TypeError);
    });
    it("should throw exception if first argument is object", () => {
      expect(() => parser.parse({ "ipa": "a" })).to.throw(TypeError);
    });
    it("should throw exception if first argument is a function", () => {
      expect(() => parser.parse(() => "a")).to.throw(TypeError);
    });
    it("should throw exception if first argument is a number", () => {
      expect(() => parser.parse(42)).to.throw(TypeError);
    });
    it("should throw exception if first argument is a regex", () => {
      expect(() => parser.parse(/a/)).to.throw(TypeError);
    });
    it("should throw exception if first argument is a boolean", () => {
      expect(() => parser.parse(true)).to.throw(TypeError);
    });
  });
});
