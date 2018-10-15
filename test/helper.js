let fs = require('fs');
// var parser = require("../src/index").parser;

function consonant(voiced, places, manner, lateral, ejective, nasal) {
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
    "nasal": nasal,
    "ejective": (ejective ? true : false),
    "lateral": (lateral ? true : false),
  };

  return segment;
}

function isVoiced(word) {
  return word == "voiced";
}

function parse(description) {
  let words = description.split(" ");

  let places = [];
  let lateral = false;
  let ejective = false;

  let manner = words[words.length - 1];

  let nasal = false;
  if (manner == "nasal") {
    manner = "plosive";
    nasal = true;
  }

  let voiced = isVoiced(words[0]);
  for (let i = 1; i < words.length - 1; i++) {
    let word = words[i];
    switch (word) {
      case "lateral": lateral = true; break;
      case "ejective": ejective = true; break;
      case "nasal": nasal = true; break;
      default: places.push(word);
    }
  }
  return consonant(voiced, places, manner, lateral, ejective, nasal);
}

module.exports = {
  loadJson: (path) => {
    return JSON.parse(fs.readFileSync(__dirname + path, "utf8"));
  },
  consonant: consonant,
  parse: parse
}