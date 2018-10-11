module.exports = class VoicingHelper {
  constructor(voiced) {
    this.voiced = voiced;
    this.phonation = voiced ? "modal" : "voiceless";
    this.aspirated = false;
  }

  addDiacritic(label) {
    switch (label) {
      case "Voiceless": {
        this.voiced = false;
        this.phonation = "voiceless";
      }; break;
      case "Voiced": {
        this.voiced = true;
        this.phonation = "modal";
      }; break;
      case "Breathy voice": {
        this.voiced = true;
        this.phonation = "breathy";
      }; break;
      case "Creaky voice": {
        this.voiced = true;
        this.phonation = "creaky";
      }; break;
      case "Aspirated": this.aspirated = true; break;
      default: // InternErr
    }
  }

  build() {
    return {
      "voiced": this.voiced,
      "phonation": this.phonation,
      "aspirated": this.aspirated
    }
  }

  buildWith(second) {
    if (second.voiced != this.voiced) {
      return "error";
    }

    let phonation = (this.phonation == "modal" ? second.phonation : this.phonation);

    return {
      "voiced": this.voiced,
      "phonation": phonation,
      "aspirated": this.aspirated || second.aspirated
    }

  }

}