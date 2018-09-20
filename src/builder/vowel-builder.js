const ToneMarkHelper = require("./tone-mark-helper");
const SegmentHelper = require("./segment-helper");

module.exports = class VowelBuilder {
  constructor(vowel) {
    this.toneMarkHelper = new ToneMarkHelper();
    this.segmentHelper = new SegmentHelper(true, true);

    this.height = vowel.height;
    this.backness = vowel.backness;
    this.rounded = vowel.rounded;
    this.nasalized = false;
  }

  /*
   _centralize() {
    this.backness = VowelBackness.CENTRAL;
  }

  _midCendtralize() {
    if (this.backness > 0) {
      this.backness--;
    } else if (this.backness < 0) {
      this.backness++;
    }

    if (this.height > 0) {
      this.height--;
    } else if (this.height < 0) {
      this.height++;
    }
  }

  _lower() {
    if (this.height > VowelHeight.OPEN) {
      this.height += -1;
    }
  }

  _raise() {
    if (this.height < VowelHeight.CLOSE) {
      this.height += +1;
    }
  }

  _advance() {
    if (this.backness < VowelBackness.FRONT) {
      this.backness += +1;
    }
  }

  _retracte() {
    if (this.backness > VowelBackness.BACK) {
      this.backness += -1;
    }
  }
  */

  addDiacritic(diacritic) {
    switch (diacritic.type) {
      case "tone": this.toneMarkHelper.set(diacritic.label); break;
      case "quantity": this.segmentHelper.updateQuantity(diacritic.label); break;
    }
  }

  end() {
    let segment = {
      "segment": true,
      "category": "vowel",
      "quantity": this.segmentHelper.getQuantity(),
      "voiced": this.segmentHelper.getVoiced(),
      "syllabic": this.segmentHelper.getSyllabic(),
      "height": this.height,
      "backness": this.backness,
      "rounded": this.rounded,
      "nasalized": this.nasalized
    }

    let result = [segment];

    if (this.toneMarkHelper.isTone()) {
      result.push(this.toneMarkHelper.buildTone());
    }

    return result;
  }
}