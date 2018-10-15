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

module.exports = {
  orderPlaces: orderPlace,
  isCoronal: isCoronal
}