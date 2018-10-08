module.exports = class VoicingHelper {
  constructor(voiced) {
    this.voiced = voiced;
    this.phonation = voiced ? "modal" : "voiceless";
    this.aspirated = false;
  }

  addDiacritic(label) {
    switch (label) {
      case "Voiceless": this.voiced = false; break;
      case "Voiced": {
        this.voiced = true;
        if (this.phonation == "voiceless") { this.phonation = "modal" };
      } break;
      case "Breathy voice": this.phonation = "breathy"; break;
      case "Creaky voice": this.phonation = "creaky"; break;
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
}