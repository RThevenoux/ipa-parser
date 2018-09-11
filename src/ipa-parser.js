var IpaSyntaxError = require("./error/ipa-syntax-error");
let UnitsBuilder = require("./builder/units-builder");

module.exports = class IpaParser {

  constructor(mapper, normalization) {
    this.mapper = mapper;
    this.normalization = normalization;
  }

  /**
  * @param {String} ipaString
  * @returns {AbstractPhoneme[]} 
  */
  parse(ipaString) {

    if (typeof ipaString != 'string' && !(ipaString instanceof String)) {
      throw new TypeError("Input is not a string");
    }

    // Replace character by the standards ones, like ligatures, diacrtics, etc.
    let normalized = this._normalize(ipaString);

    return this._parse(normalized);
  }

  /**
   * 
   * @param {String} input a 'IPA' string
   * @returns {String} 
   */
  _normalize(input) {
    let tmp = this._replaceAll(input, this.normalization);

    // Use the 'decompose' form of the letter with diacritic
    // except for C with cedilla
    tmp = tmp.normalize("NFD");
    tmp = tmp.replace(/\u0063\u0327/g, "\u00E7"); // LATIN SMALL LETTER C WITH CEDILLA

    return tmp;
  }

  /**
   * @param {String} normalized a 'IPA' normalized String 
   * @returns {AbstractPhoneme[]}
   */
  _parse(normalized) {
    let builder = new UnitsBuilder();

    let transcriptionType = "none";
    let state = "INIT";
    for (let i = 0; i < normalized.length; i++) {
      let char = normalized[i];
      let symbol = this.mapper.get(char);

      switch (symbol.type) {
        // BRACKET MANAGEMENT
        case "bracket": {
          switch (state) {

            case "INIT": {
              if (!symbol.start) {
                throw new IpaSyntaxError("Unexpected close bracket without open bracket. Close bracket: " + char);
              }
              transcriptionType = symbol.start;
              state = "OPEN";
            }; break;

            case "OPEN": {
              if (!symbol.end) {
                throw new IpaSyntaxError("Unexpected open bracket after an other one. Second bracket: " + char);
              }
              if (symbol.end !== transcriptionType) {
                throw new IpaSyntaxError("Opening bracket do not match ending bracket. Ending bracket: " + char);
              }
              state = "CLOSE";
            }; break;

            case "CLOSE":
              throw new IpaSyntaxError("Unexpected bracket: " + char);
          }
        }; break;

        // SPACING MANAGEMENT
        case "spacing": {
          builder.spacing();
        }; break;

        // DATA MANAGEMENT
        default: {

          if (state == "CLOSE") {
            throw new IpaSyntaxError("Data after closing bracket. Data: " + char);
          } else if (state == "INIT") {
            state = "OPEN";
          }

          builder.add(symbol);
        }
      }

    }
    // End of input
    if (transcriptionType !== "none" && state == "OPEN") {
      throw new IpaSyntaxError("Closing bracket is mising");
    }
    let phonemes = builder.end();

    return {
      "type": transcriptionType,
      "units": phonemes
    };
  }

  _replaceAll(input, actions) {
    let tmp = input;
    for (let key in actions) {
      let regex = new RegExp(key, 'gu');
      tmp = tmp.replace(regex, actions[key]);
    }
    return tmp;
  }
}