let fs = require('fs');
let expect = require("chai").expect;
let parser = require("../src/index.js").parser;

function parse(description) {
  let words = description.split(" ");
  let voiced = (words[0] == "voiced");
  let places = words.slice(1);
  return affricate(places, voiced);
};

function affricate(places, voiced, lateral, ejective) {
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
    "manner": "affricate",
    "ejective": (ejective ? true : false),
    "lateral": (lateral ? true : false),
  };

  return segment;
}

let data = JSON.parse(fs.readFileSync(__dirname + "/affricate-data.json", "utf8"));
describe("ipa-parser : affricate", () => {
  for (let key in data.simple) {
    let description = data.simple[key];
    let expected = [parse(description)];
    let actual = parser.parse(key).units;

    it("should parse '" + key + "' as " + description, () => {
      expect(actual).to.eql(expected);
    })
  }
});