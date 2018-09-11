const ToneHelper = require("./tone-mark-helper");

module.exports = class VowelBuilder {
  constructor(data) {
    this.toneHelper = new ToneHelper();
  }

  addDiacritic(data) {
    switch (data.diacritic.type) {
      case "tone": this.toneHelper.set(data.diacritic.label); break;
    }
  }


  end() {
    let result = [];
    if (this.toneHelper.isTone()) {
      result.push(this.toneHelper.buildTone());
    }
    return result;
  }
}