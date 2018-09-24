const map = {
  "extra-low": 1,
  "low": 2,
  "mid": 3,
  "high": 4,
  "extra-high": 5
};

module.exports = class ToneLettersBuilder {
  constructor(tone) {
    this.heights = [map[tone.label]];
    this.firstLabel = tone.label;
  }

  addTone(tone) {
    this.heights.push(map[tone.label])
  }

  end() {
    let label = this._computeLabel();
    return [{ "segment": false, "category": "tone", "label": label, "heights": this.heights }];
  }

  _computeLabel() {

    let state = "flat";

    for (let i = 1; i < this.heights.length; i++) {
      let currentHeight = this.heights[i];
      let lastHeight = this.heights[i - 1];
      if (currentHeight == lastHeight) {
        // do nothing
      } else if (currentHeight > lastHeight) {
        // rise
        switch (state) {
          case "flat":
            if (lastHeight >= 3) {
              state = "high-rising";
            } else if (currentHeight <= 3) {
              state = "low-rising";
            } else {
              state = "rising";
            }
            break;

          case "low-rising":
            if (currentHeight > 3) {
              state = "rising";
            }//else stay at low-rising 
            break;

          case "low-falling":
          case "high-falling":
          case "falling":
            state = "falling-rising"; break;

          case "rising-falling":
            return "other";

          case "high-rising":
          case "rising":
          case "falling-rising":
            // do nothing
            break;
          default:
          // InternErr
        }
      } else {
        // fall
        switch (state) {
          case "flat":
            if (lastHeight <= 3) {
              state = "low-falling";
            } else if (currentHeight >= 3) {
              state = "high-falling";
            } else {
              state = "falling";
            }
            break;

          case "high-falling":
            if (currentHeight < 3) {
              state = "falling";
            } // else stay at high-falling
            break;

          case "low-rising":
          case "high-rising":
          case "rising":
            state = "rising-falling"; break;

          case "falling-rising":
            return "other";

          case "low-falling":
          case "falling":
          case "rising-falling":
            // do nothing
            break;
          default: // InternErr
        }
      }
    }

    if (state === "flat") {
      return this.firstLabel;
    }

    return state;
  }
}