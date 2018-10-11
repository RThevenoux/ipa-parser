var expect = require("chai").expect;
var parser = require("../src/index.js").parser

function expectUnitsOf(string) {
  return expect(parser.parse(string).units);
}

function vowel(heigh, backness, round, map) {
  let vowel = {
    "segment": true,
    "category": "vowel",
    "syllabic": true,
    "voicing": {
      "voiced": true,
      "phonation": "modal",
      "aspirated": false
    },
    "quantity": "short",
    "height": heigh,
    "backness": backness,
    "rounded": round,
    "roundednessModifier": "none",
    "nasalized": false,
    "rhotacized": false,
    "tongueRoot": "neutral"
  };

  if (map) {
    for (let key in map) {
      vowel[key] = map[key];
    }
  }

  return vowel;
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

  describe("articulation diacritics", () => {
    it("should raise height if 'Up Tack' is present", () => {
      expectUnitsOf("ə" + `\u031D`).to.eql([vowel(1, 0, false)]);
      expectUnitsOf("ʊ" + `\u031D`).to.eql([vowel(3, -1, true)]);
    });
    it("should lower height if 'Down Tack' is present", () => {
      expectUnitsOf("ə" + `\u031E`).to.eql([vowel(-1, 0, false)]);
      expectUnitsOf("ʊ" + `\u031E`).to.eql([vowel(1, -1, true)]);
    });
    it("should advance backness if 'Plus Sign' is present", () => {
      expectUnitsOf("ə" + `\u031F`).to.eql([vowel(0, 1, false)]);
      expectUnitsOf("ʊ" + `\u031F`).to.eql([vowel(2, 0, true)]);
    });
    it("should retracte backness if 'Minus Sign' is present", () => {
      expectUnitsOf("ə" + `\u0320`).to.eql([vowel(0, -1, false)]);
      expectUnitsOf("ʊ" + `\u0320`).to.eql([vowel(2, -2, true)]);
    });
    it("should update centralize backness if 'Diaresis' is present", () => {
      expectUnitsOf("ə" + `\u0308`).to.eql([vowel(0, 0, false)]);
      expectUnitsOf("ʊ" + `\u0308`).to.eql([vowel(2, 0, true)]);
      expectUnitsOf("i" + `\u0308`).to.eql([vowel(3, 0, false)]);
    });
    it("should centralize backness and height if 'X Above' is present", () => {
      expectUnitsOf("ə" + `\u033D`).to.eql([vowel(0, 0, false)]);
      expectUnitsOf("ʊ" + `\u033D`).to.eql([vowel(1, 0, true)]);
      expectUnitsOf("i" + `\u033D`).to.eql([vowel(2, 1, false)]);
      expectUnitsOf("ɒ" + `\u033D`).to.eql([vowel(-2, -1, true)]);
    });
    it("should not modifie extrem value", () => {
      expectUnitsOf("i" + `\u031D`).to.eql([vowel(3, 2, false)]);
      expectUnitsOf("i" + `\u031F`).to.eql([vowel(3, 2, false)]);
      expectUnitsOf("ɒ" + `\u031E`).to.eql([vowel(-3, -2, true)]);
      expectUnitsOf("ɒ" + `\u0320`).to.eql([vowel(-3, -2, true)]);
    });
  });

  describe("co-articulation diacritics", () => {
    it("should advance tongue root if 'Left Tack' is present", () => {
      expectUnitsOf("a" + `\u0318`).to.eql([vowel(-3, 2, false, { tongueRoot: "advanced" })]);
    });
    it("should retracte tongue root if 'Right Tack' is present", () => {
      expectUnitsOf("a" + `\u0319`).to.eql([vowel(-3, 2, false, { tongueRoot: "retracted" })]);
    });
    it("should be more round if 'Left Half Ring' is present", () => {
      expectUnitsOf("a" + `\u031C`).to.eql([vowel(-3, 2, false, { roundednessModifier: "less" })]);
    });
    it("should be less round if 'Right Half Ring' is present", () => {
      expectUnitsOf("a" + `\u0339`).to.eql([vowel(-3, 2, false, { roundednessModifier: "more" })]);
    });
    it("should be nasalized if 'Tilde' is present", () => {
      expectUnitsOf("a" + `\u0303`).to.eql([vowel(-3, 2, false, { nasalized: true })]);
    });
    it("should be rhoticazed if 'Hook' is present", () => {
      expectUnitsOf("a" + `\u02DE`).to.eql([vowel(-3, 2, false, { rhotacized: true })]);
    });
  });
  describe("phonation diacritics", () => {
    it("should unvoiced if 'ring below' is present", () => {
      let segment = parser.parse("a" + "\u0325").units[0];
      expect(segment.voicing).to.have.property("voiced", false);
    });
    it("should be breathy voiced if 'Diaerisis Below' is present", () => {
      let segment = parser.parse("a" + "\u0324").units[0];
      expect(segment.voicing).to.have.property("phonation", "breathy");
    });
    it("should be creay voiced if 'Tilde Below' is present", () => {
      let segment = parser.parse("a" + "\u0330").units[0];
      expect(segment.voicing).to.have.property("phonation", "creaky");
    });
  });

  describe("other diacritics", () => {
    it("should be non-syllabic if 'inverted breve below' is present", () => {
      let segment = parser.parse("a" + "\u032F").units[0];
      expect(segment).to.have.property("syllabic", false);
    });
  });
});