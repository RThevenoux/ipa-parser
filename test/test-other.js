var expect = require("chai").expect;

var ipaParser = require("../src/index.js");
var IpaCharacterError = require("../src/error/ipa-character-error.js");
var IpaSyntaxError = require("../src/error/ipa-syntax-error.js");

var parser = ipaParser.parser;

describe('ipa-parser : other', () => {

  describe('Transcription type', () => {
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

  describe('Invalid string', () => {
    it("should throw exception if not IPA character", () => {
      expect(() => parser.parse("€")).to.throw(IpaCharacterError);
      expect(() => parser.parse("#")).to.throw(IpaCharacterError);
      expect(() => parser.parse("7")).to.throw(IpaCharacterError);
    });
  });

  describe('Invalid argument type', () => {
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