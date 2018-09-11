const VowelBuilder = require("./vowel-builder");
const ConsonnantBuilder = require("./consonant-builder");
const ToneLettersBuilder = require("./tone-letters-builder");

module.exports = class UnitsBuilder {
  constructor() {
    this.state = "init";
    this.units = [];
    this.currentBuilder = null;
  }

  add(data) {
    switch (data.type) {
      case "vowel": {
        this._endCurrentBuilder();
        this.currentBuilder = new VowelBuilder(data);
        this.state = "vowel";

      }; break;
      case "consonnant": {
        if (this.state == "consonnant" && this.currentBuilder.expectConsonnant()) {
          this.currentBuilder.addConsonnant(data);
        } else {
          this._endCurrentBuilder();
          this.currentBuilder = new ConsonnantBuilder(data);
          this.state = "consonnant";
        }
      }; break;
      case "tone-letter": {
        if (this.state == "tone-letter") {
          this.currentBuilder.addTone(data);
        } else {
          this._endCurrentBuilder();
          this.currentBuilder = new ToneLettersBuilder(data);
          this.state = "tone-letter";
        }
      }; break;
      case "diacritic": {
        if (this.state === "vowel" || this.state === "consonnant") {
          this.currentBuilder.addDiacritic(data);
        } else {
          // ERR
        }
      }; break;
      case "supra": {
        this._endCurrentBuilder();
        this.units.push(this._buildSupra(data));
        this.state = "init";
      }; break;
      case "tie-bar": {
        if (this.state === "consonnant") {
          this.currentBuilder.addTieBar();
        } else {
          //ERR
        }
      }; break;
    }
  }

  spacing(){
    this._endCurrentBuilder();
    this.state = "init";
  }

  end() {
    this._endCurrentBuilder();
    return this.units;
  }

  _endCurrentBuilder() {
    if (this.currentBuilder != null) {
      this.units = this.units.concat(this.currentBuilder.end());
      this.currentBuilder = null;
    }
  }

  _buildSupra(data) {
    return { "segment": false, "category": data.category, "value": data.value };
  }
}