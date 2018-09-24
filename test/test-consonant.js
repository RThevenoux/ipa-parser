var expect = require("chai").expect;

var ipaParser = require("../src/index.js");

var parser = ipaParser.parser;

function expectUnitsOf(string) {
  return expect(parser.parse(string).units);
}

function consonant(place, manner, lateral, voiced) {
  if (typeof (place) == "string") {
    place = [place];
  }

  let segment = {
    "segment": true,
    "category": "consonant",
    "syllabic": false,
    "voiced": voiced,
    "quantity": "short",
    "place": place,
    "manner": manner,
    "lateral": lateral,
  };

  return segment;
}

function plosive(place, voiced) {
  return consonant(place, "plosive", false, voiced);
}
function nasal(place) {
  return consonant(place, "nasal", false, true);
}
function trill(place) {
  return consonant(place, "trill", false, true);
}
function flap(place, lateral) {
  return consonant(place, "flap", lateral, true);
}
function fricative(place, voiced, lateral) {
  return consonant(place, "fricative", (lateral ? lateral : false), voiced);
}
function approximant(place, lateral) {
  return consonant(place, "approximant", (lateral ? lateral : false), true);
}
function implosive(place) {
  return consonant(place, "implosive", false, true);
}
function click(place, lateral) {
  return consonant(place, "click", (lateral ? lateral : false), false);
}

describe("ipa-parser : consonant", () => {
  it("should parse plosive", () => {
    expectUnitsOf("p").to.eql([plosive("bilabial", false)]);
    expectUnitsOf("b").to.eql([plosive("bilabial", true)]);
    expectUnitsOf("t").to.eql([plosive("alveolar", false)]);
    expectUnitsOf("d").to.eql([plosive("alveolar", true)]);
    expectUnitsOf("ʈ").to.eql([plosive("retroflex", false)]);
    expectUnitsOf("ɖ").to.eql([plosive("retroflex", true)]);
    expectUnitsOf("c").to.eql([plosive("palatal", false)]);
    expectUnitsOf("ɟ").to.eql([plosive("palatal", true)]);
    expectUnitsOf("k").to.eql([plosive("velar", false)]);
    expectUnitsOf("ɡ").to.eql([plosive("velar", true)]);
    expectUnitsOf("q").to.eql([plosive("uvular", false)]);
    expectUnitsOf("ɢ").to.eql([plosive("uvular", true)]);
    expectUnitsOf("ʔ").to.eql([plosive("glottal", false)]);
    expectUnitsOf("ʡ").to.eql([plosive("epiglottal", false)]);
  });
  it("should parse nasal", () => {
    expectUnitsOf("m").to.eql([nasal("bilabial")]);
    expectUnitsOf("ɱ").to.eql([nasal("labiodental")]);
    expectUnitsOf("n").to.eql([nasal("alveolar")]);
    expectUnitsOf("ɳ").to.eql([nasal("retroflex")]);
    expectUnitsOf("ɲ").to.eql([nasal("palatal")]);
    expectUnitsOf("ŋ").to.eql([nasal("velar")]);
    expectUnitsOf("ɴ").to.eql([nasal("uvular")]);
  });
  it("should parse trill", () => {
    expectUnitsOf("ʙ").to.eql([trill("bilabial")]);
    expectUnitsOf("r").to.eql([trill("alveolar")]);
    expectUnitsOf("ʀ").to.eql([trill("uvular")]);
  });
  it("should parse tap or flap", () => {
    expectUnitsOf("ⱱ").to.eql([flap("labiodental", false)]);
    expectUnitsOf("ɾ").to.eql([flap("alveolar", false)]);
    expectUnitsOf("ɽ").to.eql([flap("retroflex", false)]);
    expectUnitsOf("ɺ").to.eql([flap("alveolar", true)]);
  });
  it("should parse fricative", () => {
    expectUnitsOf("ɸ").to.eql([fricative("bilabial", false)]);
    expectUnitsOf("β").to.eql([fricative("bilabial", true)]);
    expectUnitsOf("f").to.eql([fricative("labiodental", false)]);
    expectUnitsOf("v").to.eql([fricative("labiodental", true)]);
    expectUnitsOf("θ").to.eql([fricative("dental", false)]);
    expectUnitsOf("ð").to.eql([fricative("dental", true)]);
    expectUnitsOf("s").to.eql([fricative("alveolar", false)]);
    expectUnitsOf("z").to.eql([fricative("alveolar", true)]);
    expectUnitsOf("ʃ").to.eql([fricative("postalveolar", false)]);
    expectUnitsOf("ʒ").to.eql([fricative("postalveolar", true)]);
    expectUnitsOf("ʂ").to.eql([fricative("retroflex", false)]);
    expectUnitsOf("ʐ").to.eql([fricative("retroflex", true)]);
    expectUnitsOf("ç").to.eql([fricative("palatal", false)]);
    expectUnitsOf("ʝ").to.eql([fricative("palatal", true)]);
    expectUnitsOf("x").to.eql([fricative("velar", false)]);
    expectUnitsOf("ɣ").to.eql([fricative("velar", true)]);
    expectUnitsOf("χ").to.eql([fricative("uvular", false)]);
    expectUnitsOf("ʁ").to.eql([fricative("uvular", true)]);
    expectUnitsOf("ħ").to.eql([fricative("pharyngal", false)]);
    expectUnitsOf("ʕ").to.eql([fricative("pharyngal", true)]);
    expectUnitsOf("h").to.eql([fricative("glottal", false)]);
    expectUnitsOf("ɦ").to.eql([fricative("glottal", true)]);
    expectUnitsOf("ʜ").to.eql([fricative("epiglottal", false)]);
    expectUnitsOf("ʢ").to.eql([fricative("epiglottal", true)]);
  });
  it("should parse fricative with two place", () => {
    expectUnitsOf("ɕ").to.eql([fricative(["alveolar", "palatal"], false)]);
    expectUnitsOf("ʑ").to.eql([fricative(["alveolar", "palatal"], true)]);
    expectUnitsOf("ɧ").to.eql([fricative(["postalveolar", "velar"], false)]);
    expectUnitsOf("ʍ").to.eql([fricative(["bilabial", "velar"], false)]);
  });
  it("should parse lateral fricative", () => {
    expectUnitsOf("ɬ").to.eql([fricative("alveolar", false, true)]);
    expectUnitsOf("ɮ").to.eql([fricative("alveolar", true, true)]);
  });
  it("should parse approximant", () => {
    expectUnitsOf("ʋ").to.eql([approximant("labiodental")]);
    expectUnitsOf("ɹ").to.eql([approximant("alveolar")]);
    expectUnitsOf("ɻ").to.eql([approximant("retroflex")]);
    expectUnitsOf("j").to.eql([approximant("palatal")]);
    expectUnitsOf("ɰ").to.eql([approximant("velar")]);
  });
  it("should parse approximant with two place", () => {
    expectUnitsOf("w").to.eql([approximant(["bilabial", "velar"])]);
    expectUnitsOf("ɥ").to.eql([approximant(["bilabial", "palatal"])]);
  });
  it("should parse lateral approximant", () => {
    expectUnitsOf("l").to.eql([approximant("alveolar", true)]);
    expectUnitsOf("ɭ").to.eql([approximant("retroflex", true)]);
    expectUnitsOf("ʎ").to.eql([approximant("palatal", true)]);
    expectUnitsOf("ʟ").to.eql([approximant("velar", true)]);
  });
  it("should parse click", () => {
    expectUnitsOf("ʘ").to.eql([click("bilabial")]);
    expectUnitsOf("ǀ").to.eql([click("dental")]);
    expectUnitsOf("ǃ").to.eql([click("alveolar")]);
    expectUnitsOf("ǁ").to.eql([click("alveolar", true)]);
  });
  it("should parse click with two place", () => {
    expectUnitsOf("ǂ").to.eql([click(["alveolar", "palatal"])]);
  });
  it("should parse implosive", () => {
    expectUnitsOf("ɓ").to.eql([implosive("bilabial")]);
    expectUnitsOf("ɗ").to.eql([implosive("alveolar")]);
    expectUnitsOf("ʄ").to.eql([implosive("palatal")]);
    expectUnitsOf("ɠ").to.eql([implosive("velar")]);
    expectUnitsOf("ʛ").to.eql([implosive("uvular")]);
  });
}); 