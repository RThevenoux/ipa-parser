const VowelBuilder = require("./vowel-builder");
const ConsonantBuilder = require("./consonant-builder");
const ToneLettersBuilder = require("./tone-letters-builder");

const IpaInternalError = require("./../error/ipa-internal-error");

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

      case "consonant": {
        if (this.state == "consonant" && this.currentBuilder.isExpectingConsonant()) {
          this.currentBuilder.addConsonant(data);
        } else {
          this._endCurrentBuilder();
          this.currentBuilder = new ConsonantBuilder(data);
          this.state = "consonant";
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
        if (this.state === "vowel" || this.state === "consonant") {
          this.currentBuilder.addDiacritic(data.diacritic);
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
        if (this.state === "consonant") {
          this.currentBuilder.addTieBar();
        } else {
          //ERR
        }
      }; break;

      default: {
        throw new IpaInternalError("Invalid data type : '" + data.type + "'");
      }
    }
  }

  spacing() {
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