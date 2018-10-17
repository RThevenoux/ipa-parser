var expect = require("chai").expect;
var parser = require("../src/index.js").parser
var helper = require("./helper");

describe("ipa-parser : vowel", () => {
  helper.testFile("/data/vowel.json");
  
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