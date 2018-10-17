let helper = require('./helper');
let expect = require("chai").expect;
let parser = require("../src/index.js").parser;

describe("ipa-parser : consonnant", () => {
  helper.testFile("/data/consonant.json");

  describe("phonation diacritics", () => {
    it("should unvoiced if 'ring below' is present", () => {
      let segment = parser.parse("n" + "\u0325").units[0];
      expect(segment.voicing).to.have.property("voiced", false);
    });
    it("should voiced if 'Caron Below' is present", () => {
      let segment = parser.parse("s" + "\u032C").units[0];
      expect(segment.voicing).to.have.property("voiced", true);
    });
    it("should be aspirated if 'Superscript h' is present", () => {
      let segment = parser.parse("t" + "\u02B0").units[0];
      expect(segment.voicing).to.have.property("aspirated", true);
    });
    it("should be breathy voiced if 'Diaerisis Below' is present", () => {
      let segment = parser.parse("t" + "\u0324").units[0];
      expect(segment.voicing).to.have.property("phonation", "breathy");
    });
    it("should be creay voiced if 'Tilde Below' is present", () => {
      let segment = parser.parse("t" + "\u0330").units[0];
      expect(segment.voicing).to.have.property("phonation", "creaky");
    });
  });
  describe("other diacritics", () => {
    it("should be syllabic if 'vertical line' is present", () => {
      let segment = parser.parse("n" + "\u0329").units[0];
      expect(segment).to.have.property("syllabic", true);
    });
  });
});
