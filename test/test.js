var expect = require("chai").expect;

var ipaParser = require("../src/index.js");
var IpaCharacterError = require("../src/error/ipa-character-error");
var IpaSyntaxError = require("../src/error/ipa-syntax-error");

var parser = ipaParser.parser;

function expectUnitsOf(string) {
  return expect(parser.parse(string).units);
}

function supra(category, value) {
  return { "segment": false, "category": category, "value": value };
}

describe('ipa-parser', () => {

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

  describe('Single-character supra-segmental', () => {
    describe('Stress', () => {
      // Warning primary stress used \u02C8 and not apostrophe \u0027
      it("should parse 'Primary stress'", () => {
        expectUnitsOf("ˈ").to.eql([supra("stress", "primary-stress")]);
      });
      it("should parse 'Secondary stress'", () => {
        expectUnitsOf("ˌ").to.eql([supra("stress", "secondary-stress")]);
      })
    });
    describe('Separator', () => {
      it("should parse 'Syllable break'", () => {
        expectUnitsOf(".").to.eql([supra("separator", "syllable-break")]);
      });
      it("should parse 'Minor group'", () => {
        expectUnitsOf("|").to.eql([supra("separator", "minor-group")]);
      });
      it("should parse 'Major group'", () => {
        expectUnitsOf("‖").to.eql([supra("separator", "major-group")]);
      });
      it("should parse 'Linking'", () => {
        expectUnitsOf("‿").to.eql([supra("separator", "linking")]);
      });
    });
    describe('Tone-step', () => {
      it("should parse 'Downstep'", () => {
        expectUnitsOf("ꜜ").to.eql([supra(`tone-step`, `downstep`)]);
      });
      it("should parse 'Upstep'", () => {
        expectUnitsOf("ꜛ").to.eql([supra(`tone-step`, `upstep`)]);
      });
    });
    describe('Intornation', () => {
      it("should parse 'Global Rise'", () => {
        expectUnitsOf("↗").to.eql([supra(`intonation`, `global-rise`)]);
      });
      it("should parse 'Global Fall'", () => {
        expectUnitsOf("↘").to.eql([supra(`intonation`, `global-fall`)]);
      });
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
