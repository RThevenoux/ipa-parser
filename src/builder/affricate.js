const Voicing = require("./voicing");
const Place = require("./place");
const IpaSyntaxtError = require("../error/ipa-syntax-error");

function _computeAffricateVoicing(first, second) {
  // General case
  if (first.isVoiced() == second.isVoiced()) {
    return Voicing.merge(first.voicing, second.voicing);
  }

  // Ad-hoc case for 'ʡ͡ʕ' & 'ʡ͡ʢ'
  if (first.place == "epiglottal" && first.isVoiced() == false) {
    if (second.place == "pharyngeal" || second.place == "epiglottal") {
      return second.voicing.build();
    }
  }

  // Invalid voicing combination
  throw new IpaSyntaxtError("Invalid voicing for affricate");
}

function _computeTrilledAffricateVoicing(first, second) {
  if (first.isVoiced() == second.isVoiced()) {
    return Voicing.merge(first.voicing, second.voicing);
  }
  throw new IpaSyntaxtError("Invalid voicing for trilled affricate");
}

function _computeAffricatePlace(first, second) {
  // General case
  if (second.place == first.place) return second.place;

  // Ad-hoc case
  switch (first.place) {
    // Specific case for 't' + Coronal
    case "alveolar": if (Place.isCoronal(second.place)) return second.place; break;
    // Specific case for 'ʡ' + Pharyngeal
    case "epiglottal": if (second.place == "pharyngeal") return second.place; break;
    // no default. Other case will throw Error
  }

  throw new IpaSyntaxtError("Invalid affricate places: '" + first.place + "' + '" + second.place + "'");
}

function _computeTrilledAffricatePlace(first, second) {
  if (second.place == first.place) return second.place;
  throw new IpaSyntaxtError("Invalid trilled affricate places: '" + first.place + "' + '" + second.place + "'");
}

module.exports = {
  computeAffricateVoicing: _computeAffricateVoicing,
  computeTrilledAffricateVoicing: _computeTrilledAffricateVoicing,
  computeAffricatePlace: _computeAffricatePlace,
  computeTrilledAffricatePlace: _computeTrilledAffricatePlace
}