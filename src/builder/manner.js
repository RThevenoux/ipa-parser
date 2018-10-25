// TODO : finish lower/raise
// see https://en.wikipedia.org/wiki/Relative_articulation#Raised_and_lowered
//
// [vowel]-[approximant]--[fricative]--------<[stop]
//                        [tap  fric]--[flap]>[stop]
//               [trill]--[tril fric]-- XXX
//
// trilled fricative = trill + fricative ? => https://en.wikipedia.org/wiki/Dental,_alveolar_and_postalveolar_trills#Voiced_alveolar_fricative_trill
// https://en.wikipedia.org/wiki/Fricative_consonant :
//  - fricative trill 
//  - fricative flap
// https://en.wikipedia.org/wiki/Flap_consonant#Tapped_fricatives
// One fricative flap : https://en.wikipedia.org/wiki/Voiced_alveolar_fricative#Voiced_alveolar_non-sibilant_fricative
//

function lower(manner) {
  switch (manner) {
    case "stop": return "fricative";
    case "fricative": return "approximant";
    case "approximant": return "vowel";
    case "flap": return "tapped-fricative";
    case "tapped-fricative": return "tapped-fricative";
    case "trill": return "trill";
    case "trilled-fricative": return "trill";
    case "vowel": return "vowel";

    default: throw new IpaInternError("Unsupported manner: '" + manner + "'");
  }
}

function raise(manner) {
  switch (manner) {
    case "stop": return "stop";
    case "fricative": return "stop";
    case "approximant": return "fricative";
    case "flap": return "stop";
    case "tapped-fricative": return "flap";
    case "trill": return "trilled-fricative";
    case "trilled-fricative": return "trilled-fricative";
    case "vowel": return "approximant";

    default: throw new IpaInternError("Unsupported manner: '" + manner + "'");
  }
}

module.exports = {
  lower: lower,
  raise: raise
}