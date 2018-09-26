const SegmentHelper = require("./segment-helper");

module.exports = class ConsonantBuilder {
  constructor(consonant) {
    this.segmentHelper = SegmentHelper.createConsonant(consonant);

    this.state = "single-char";

    this.manner = consonant.manner;
    this.ejective = false;

    this.place = consonant.place;
    this.lateral = consonant.lateral;
  }

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.segmentHelper.addTone(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
      case "syllabicity": this.segmentHelper.updateSyllabicity(diacritic.label); break;
      case "phonation": this.segmentHelper.updatePhonation(diacritic.label); break;
      case "ejective": this.ejective = true; break;
      case "release": /*TODO*/; break;
      case "articulation": /*TODO*/; break;
      case "co-articulation": /*TODO*/; break;
      default: // InternErr
    }
  }

  addTieBar() {
    if (this.state === "single-char") {
      this.state = "expecting";
    } else {
      // SyntErr
    }

  }

  isExpectingConsonant() {
    return this.state === "expecting";
  }

  addConsonant(consonant) {
    if (this.isExpectingConsonant()) {
      this.state = "double-char";
    } else {
      // SyntErr
    }
  }

  end() {
    if (this.isExpectingConsonant()) {
      // SyntErr
    }

    return this.segmentHelper.buildWithValues(
      {
        "manner": this.manner,
        "ejective": this.ejective,
        "place": this.place,
        "lateral": this.lateral
      }
    );
  }
}