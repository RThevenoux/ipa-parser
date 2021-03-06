const IpaSyntaxtError = require("../error/ipa-syntax-error");
const Backness = require("../constants").Backness;
const Height = require("../constants").Height;

const coronals = ["dental",
  "alveolar",
  "postalveolar",
  "retroflex",
  "alveopalatal"];

const places = [
  "bilabial",
  "labiodental",
  "dental",
  "alveolar",
  "postalveolar",
  "retroflex",
  "alveopalatal",
  "palatal",
  "velar",
  "uvular",
  "pharyngal",
  "epiglottal",
  "glottal"
];

const placeMap = {};
for (let i = 0; i < places.length; i++) {
  placeMap[places[i]] = i;
}

function orderPlace(places) {
  return places
    .map((name) => { return { "name": name, "index": placeMap[name] } }) // Create an array with the name and the index 
    .sort((a, b) => a.index - b.index) // order according to the index
    .map(data => data.name); // return an array with only the name (remove the index)
}

function isCoronal(place) {
  return coronals.includes(place);
}

function mergeCoronalType(first, second) {
  if (first == "unspecified") return second;
  if (second == "unspecified") return first;
  throw new IpaSyntaxtError("Can not merge coronal types: '" + first + "' + '" + second + '"');
}

function approximantToVowel(places) {
  // If two place, the first should be bilabial
  // The last place should defined the backness
  //  - palatal => Front vowel
  //  - velar => Back vowel
  let backness;
  let backnessPlace = places[places.length - 1];
  switch (backnessPlace) {
    case "palatal": backness = Backness["FRONT"]; break;
    case "velar": backness = Backness["BACK"]; break;
    default: throw new IpaSyntaxtError("Unsupported place for lowered approximant : " + backnessPlace);
  }

  let rounded = (places[0] == "bilabial");

  return {
    "backness": backness,
    "rounded": rounded,
    "height": Height["CLOSE"]
  }
}

module.exports = {
  orderPlaces: orderPlace,
  isCoronal: isCoronal,
  mergeCoronalType: mergeCoronalType,
  approximantToVowel: approximantToVowel
}