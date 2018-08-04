var assert = require('assert');

var Ipa = require("../src/ipa");
var Height = require("../src/phoneme/vowel-phoneme").Height;
var Backness = require("../src/phoneme/vowel-phoneme").Backness;

var parser = new Ipa().getParser();

describe('ipa-parser', function () {
  describe('# _normamlize()', function () {

    it('should not modified "a"', function () {
      assert.equal(parser._normalize("a"), "a");
    });

    it('should work with multiple character', function () {
      assert.equal(parser._normalize("abcdef"), "abcdef");
    });

    it('should separated diacritic on "ã"', function () {
      assert.equal(parser._normalize("\u00E3"), "a" + "\u0303");
    });

    it('should use the composed form for "ç" (diacritic exception)', function () {
      assert.equal(parser._normalize("ç" + "c" + "\u0327" + "ç"), "ççç");
    });

    it('should correct "g" to "ɡ"', function () {
      assert.equal(parser._normalize("g"), "\u0261");
    });

    it('should separate ligature like ʦ', function () {
      assert.equal(parser._normalize("ʦ"), "t" + "\u0361" + "s");
    });
  });

  describe('# parsePhonemes()', function () {

    describe('- Vowel input = "a"', function () {
      let result = parser.parsePhonemes("a");
      it('should be 1 phoneme', function () {
        assert.equal(result.length, 1);
      });
      let phoneme = result[0];
      it('should be base "a"', function () {
        assert.equal(phoneme.base, "a");
      });
      it('should be vowel', function () {
        assert.equal(phoneme.type, "vowel");
      });
      it('should height be "Open"', function () {
        assert.equal(phoneme.height, Height.OPEN);
      });
      it('should backness be "Front"', function () {
        assert.equal(phoneme.backness, Backness.FRONT);
      });
      it('should not be "round"', function () {
        assert.equal(phoneme.rounded, false);
      });
    });

    describe('- Nasalized vowel - input = "a \u00E3 a\u0303 a"', function () {
      let result = parser.parsePhonemes("a\u00E3a\u0303a");
      it('should be 4 phoneme', function () {
        assert.equal(result.length, 4);
      });
      let a0 = result[0];
      let a1 = result[1];
      let a2 = result[2];
      let a3 = result[3];
      it('should second should be nazalised', function () {
        assert.equal(a1.coarticulation.includes("Nasalized"), true);
      });
      it('should third should be nazalised', function () {
        assert.equal(a2.coarticulation.includes("Nasalized"), true);
      });
    });

    describe("Combining symbole", () => {
      it("should parse affricate like t͡s", () => {
        let result = parser.parsePhonemes("t͡s");
        assert(result.length, 1);
        assert(result[0].base, "ts");
      });

      it("should parse diphtong like a͡ɪ", () => {
        let result = parser.parsePhonemes("a͡ɪ");
        assert(result.length, 1);
        assert(result[0].base, "aɪ");
      });
    });
  });
});
