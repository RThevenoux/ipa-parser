module.exports = class VoicingHelper {
  constructor(voiced) {
    this.voiced = voiced;
    this.phonation = voiced ? "modal" : "voiceless";
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
      default: // InternErr
    }
  }

  build() {
    return {
      "voiced": this.voiced,
      "phonation": this.phonation,
    }
  }
}