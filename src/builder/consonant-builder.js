const SegmentHelper = require("./segment-helper");

module.exports = class ConsonnantBuilder {
  constructor(consonnant) {
    this.segmentHelper = SegmentHelper.createConsonnant(consonnant);

    this.state = "single-char";

    this.manner = consonnant.manner;
    this.place = consonnant.place;
    this.lateral = consonnant.lateral;
  }

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.segmentHelper.addTone(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
      case "syllabicity": this.segmentHelper.updateSyllabicity(diacritic.label); break;
      case "phonation": this.segmentHelper.updatePhonation(diacritic.label); break;
      case "release": /*TODO*/; break;
      case "articulation": /*TODO*/; break;
      case "co-articulation": /*TODO*/; break;
      default: // Err
    }
  }

  addTieBar() {
    if (this.state === "single-char") {
      this.state = "expecting";
    } else {
      // Err
    }

  }

  isExpectingConsonnant() {
    return this.state === "expecting";
  }

  addConsonnant(consonnant) {
    if (this.isExpectingConsonnant()) {
      this.state = "double-char";
    } else {
      // Err
    }
  }

  end() {
    if (this.isExpectingConsonnant()) {
      // Err
    }

    return this.segmentHelper.buildWithValues(
      {
        // no values yet
      }
    );
  }
}