var expect = require("chai").expect;

var ipaParser = require("../src/index.js");
var IpaCharacterError = require("../src/error/ipa-character-error");
var IpaSyntaxError = require("../src/error/ipa-syntax-error");

var parser = ipaParser.parser;

function unitsOf(string) {
  return parser.parse(string).units;
}

function expectUnitsOf(string) {
  return expect(unitsOf(string));
}

function supra(category, value) {
  return { "segment": false, "category": category, "value": value };
}

function tone(label, ...heighs) {
  return { "segment": false, "category": "tone", "label": label, "heighs": heighs };
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

  describe('Tone', () => {
    describe('Tone-mark', () => {

    });
    describe('Tone-letter', () => {
      describe('Single tone-letter', () => {
        it("should parse extra-low", () => {
          expectUnitsOf("˩").to.eql([tone("extra-low", 1)]);
        });
        it("should parse low", () => {
          expectUnitsOf("˨").to.eql([tone("low", 2)]);
        });
        it("should parse mid", () => {
          expectUnitsOf("˧").to.eql([tone("mid", 3)]);
        });
        it("should parse high", () => {
          expectUnitsOf("˦").to.eql([tone("high", 4)]);
        });
        it("should parse extra-high", () => {
          expectUnitsOf("˥").to.eql([tone("extra-high", 5)]);
        });
      });
      describe('Multiple tone-letter', () => {
        it("should parse multiple tone with same heighs to the single heigh equivalent", () => {
          expectUnitsOf("˩˩").to.eql([tone("extra-low", 1)]);
          expectUnitsOf("˦˦˦").to.eql([tone("high", 4)]);
          expectUnitsOf("˥˥˥˥").to.eql([tone("extra-high", 5)]);
        });
        it("should parse rising", () => {
          expectUnitsOf("˩˥").to.eql([tone("rising", 1,5)]);
          expectUnitsOf("˨˦").to.eql([tone("rising", 2,4)]);
          expectUnitsOf("˩˧˥").to.eql([tone("rising", 1,3,5)]);
        });
        it("should parse rising + equal as rising", () => {
          expectUnitsOf("˩˩˥").to.eql([tone("rising", 1,1,5)]);
          expectUnitsOf("˨˦˦").to.eql([tone("rising", 2,4,4)]);
          expectUnitsOf("˩˧˧˥").to.eql([tone("rising", 1,3,3,5)]);
          expectUnitsOf("˩˩˥˥").to.eql([tone("rising", 1,1,5,5)]);
        });
        it("should parse falling", () => {
          expectUnitsOf("˥˩").to.eql([tone("falling", 5,1)]);
          expectUnitsOf("˦˨").to.eql([tone("falling", 4,2)]);
          expectUnitsOf("˥˧˩").to.eql([tone("falling", 5,3,1)]);
          expectUnitsOf("˥˩˩").to.eql([tone("falling", 5,1,1)]);
          expectUnitsOf("˦˦˨").to.eql([tone("falling", 4,4,2)]);
          expectUnitsOf("˥˧˧˩").to.eql([tone("falling", 5,3,3,1)]);
          expectUnitsOf("˥˥˩˩").to.eql([tone("falling", 5,5,1,1)]);
        });
        it("should parse low-rising", () => {
          expectUnitsOf("˩˧").to.eql([tone("low-rising", 1,3)]);
          expectUnitsOf("˩˨˨").to.eql([tone("low-rising", 1,2,2)]);
          expectUnitsOf("˩˩˨").to.eql([tone("low-rising", 1,1,2)]);
        });
        it("should parse high-rising", () => {
          expectUnitsOf("˧˥").to.eql([tone("high-rising", 3,5)]);
          expectUnitsOf("˧˥˥").to.eql([tone("high-rising", 3,5,5)]);
          expectUnitsOf("˧˧˥").to.eql([tone("high-rising", 3,3,5)]);
        });
        it("should parse low-falling", () => {
          expectUnitsOf("˧˩").to.eql([tone("low-falling", 3,1)]);
          expectUnitsOf("˧˧˨").to.eql([tone("low-falling", 3,3,2)]);
          expectUnitsOf("˨˩˩").to.eql([tone("low-falling", 2,1,1)]);
        });
        it("should parse high-falling", () => {
          expectUnitsOf("˥˧").to.eql([tone("high-falling", 5,3)]);
          expectUnitsOf("˥˦˦").to.eql([tone("high-falling", 5,4,4)]);
          expectUnitsOf("˦˦˧").to.eql([tone("high-falling", 4,4,3)]);
        });
        it("should parse rising-falling", () => {
          expectUnitsOf("˧˥˩").to.eql([tone("rising-falling", 3,5,1)]);
          expectUnitsOf("˨˦˧").to.eql([tone("rising-falling", 2,4,3)]);
          expectUnitsOf("˦˥˦").to.eql([tone("rising-falling", 4,5,4)]);
          expectUnitsOf("˦˥˥˦").to.eql([tone("rising-falling", 4,5,5,4)]);
        });
        it("should parse falling-rising", () => {
          expectUnitsOf("˧˩˥").to.eql([tone("falling-rising", 3,1,5)]);
          expectUnitsOf("˨˦˦").to.eql([tone("falling-rising", 2,4,4)]);
          expectUnitsOf("˥˧˥").to.eql([tone("falling-rising", 5,3,5)]);
          expectUnitsOf("˥˧˦˥").to.eql([tone("falling-rising", 5,3,4,5)]);
        });
        it("should parse other", () => {
          expectUnitsOf("˩˥˩˥").to.eql([tone("other", 1,5,1,5)]);
          expectUnitsOf("˦˨˦˨").to.eql([tone("other", 4,2,4,2)]);
        });
      });
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
