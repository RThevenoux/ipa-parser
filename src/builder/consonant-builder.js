const ToneMarkHelper = require("./tone-mark-helper");
const SegmentHelper = require("./segment-helper");

module.exports = class ConsonnantBuilder {
  constructor(consonnant) {
    this.toneHelper = new ToneMarkHelper();
    this.segmentHelper = new SegmentHelper(false, consonnant.voiced);

    this.state = "single-char";

    /*
    this.manner = symbol.manner;
    this.place = symbol.place;
    this.lateral = symbol.lateral;
    */
  }

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.toneHelper.set(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
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

    let segment = {
      "segment": true,
      "category": "consonnant",
      "quantity": this.segmentHelper.getQuantity(),
      "voiced": this.segmentHelper.getVoiced(),
      "syllabic": this.segmentHelper.getSyllabic(),
    };

    let result = [segment];
    if (this.toneHelper.isTone()) {
      result.push(this.toneHelper.buildTone());
    }
    
    return result;
  }
}