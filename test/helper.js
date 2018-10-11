let fs = require('fs');
// var parser = require("../src/index").parser;

function consonant(voiced, places, manner, lateral, ejective) {
  if (typeof (places) == "string") {
    places = [places];
  }

  let segment = {
    "segment": true,
    "category": "consonant",
    "syllabic": false,
    "voicing": {
      "voiced": voiced,
      "phonation": (voiced ? "modal" : "voiceless"), // breathy, creaky
      "aspirated": false
    },
    "quantity": "short",
    "places": places,
    "manner": manner,
    "ejective": (ejective ? true : false),
    "lateral": (lateral ? true : false),
  };

  return segment;
}

let nasal = (places, ejective) => consonant(true, places, "nasal", false, ejective);
let approximant = (places, lateral, ejective) => consonant(true, places, "approximant", lateral, ejective);
let implosive = (voiced, places) => consonant(voiced, places, "implosive", false, false);

function isVoiced(word) {
  return word == "voiced";
}

function parse(description) {
  let words = description.split(" ");

  let places = [];
  let lateral = false;
  let ejective = false;

  let manner = words[words.length - 1];
  let voiced = isVoiced(words[0]);
  for (let i = 1; i < words.length - 1; i++) {
    let word = words[i];
    if (word == "lateral") {
      lateral = true;
    } else if (word == "ejective") {
      ejective = true;
    } else {
      places.push(word);
    }
  }
  return consonant(voiced, places, manner, lateral, ejective);
}

module.exports = {
  loadJson: (path) => {
    return JSON.parse(fs.readFileSync(__dirname + path, "utf8"));
  },
  consonant: consonant,
  parse: parse
}