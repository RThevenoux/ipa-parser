const SegmentHelper = require("./segment-helper");
const coronals = ["dental",
  "alveolar",
  "postalveolar",
  "retroflex",
  "alveopalatal"];

module.exports = class ConsonantBuilder {
  constructor(consonant) {
    this.segmentHelper = SegmentHelper.createConsonant(consonant);

    this.state = "single-char";

    this.manner = consonant.manner;
    this.ejective = false;

    this.places = consonant.places;
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

  _computeAffricatePlaces(firstPlaces, secondPlaces) {
    if (firstPlaces.length != 1 && secondPlaces.length != 1) {
      console.log("More than 1 place")
      return "error";
    }

    let first = firstPlaces[0];
    let second = secondPlaces[0];
    console.log(first + " " + second + " coronal?" + coronals.includes(second));

    if (first == "alveolar") {
      return (coronals.includes(second) ? [second] : "error");
    } else if (first == "epiglottal") {
      return (second == "pharyngeal" ? [second] : "error");
    } else {
      return (second == first ? [second] : "error");
    }
  }

  addConsonant(second) {
    if (!this.isExpectingConsonant()) {
      // SyntErr
      this.state = "error";
      return;
    }

    // Check if affricate
    let firstVoiced = this.segmentHelper.voicingHelper.voiced;
    if (this.manner == "plosive" && second.manner == "fricative") {
      if (firstVoiced == second.voiced) {
        let affricatePlaces = this._computeAffricatePlaces(this.places, second.places);
        console.log(" " + affricatePlaces);
        if (affricatePlaces != "error") {
          console.log(" > update state to " + affricatePlaces + " " + second.lateral);
          this.manner = "affricate";
          this.places = affricatePlaces;
          this.lateral = second.lateral;
          this.state = "double-char";
        } else {
          // Invalid places
          console.log(" > invalid place");
          this.state = "error";
        }

      } else {
        // Ad-hoc case for 'ʡ͡ʕ'
        if (this.places.length == 1 && second.places.length == 1
          && this.places[0] == "epiglottal" && second.places[0] == "pharyngeal"
          && firstVoiced == false) {
          this.manner = "affricate";
          this.places = ["pharyngeal"];
          this.lateral = false;
          this.state = "double-char";
          this.segmentHelper.updatePhonation("Voiced");
        } else {
          // Not same voicing
          this.state = "error";
        }
      }

    } else {
      // Not Plosive+Fricative
      this.state = "error";
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
        "places": this.places,
        "lateral": this.lateral
      }
    );
  }
}