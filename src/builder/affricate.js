const Voicing = require("./voicing");
const Place = require("./place");
const IpaSyntaxtError = require("../error/ipa-syntax-error");

function _computeAffricateVoicing(first, second) {
  if (first.isVoiced() == second.isVoiced()) {
    return Voicing.merge(first.voicing, second.voicing);
  }

  // Ad-hoc case for 'ʡ͡ʕ'
  if (first.place == "epiglottal" && second.place == "pharyngeal"
    && first.voicing.voiced == false) {
    return second.voicing.build();
  }

  // Invalid voicing combination
  throw new IpaSyntaxtError("Invalid voicing for affricate");
}

function _computeAffricatePlace(first, second) {
  switch (first.place) {
    // Specific case for 't' + Coronal
    case "alveolar": if (Place.isCoronal(second.place)) return second.place; break;
    // Specific case for ʡ͡ħ and ʡ͡ʕ
    case "epiglottal": if (second.place == "pharyngeal") return second.place; break;
    // General case
    default: if (second.place == first.place) return second.place; break;
  }

  throw new IpaSyntaxtError("Invalid affricate places: '" + first.place + "' + '" + second.place + "'");
}

module.exports = {
  computeAffricateVoicing: _computeAffricateVoicing,
  computeAffricatePlace: _computeAffricatePlace
}