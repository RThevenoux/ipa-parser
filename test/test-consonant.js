let helper = require('./helper');

describe("ipa-parser : characters and diacritics", () => {
  helper.testFile("/data/consonant.json");
  helper.testFile("/data/edge-case.json");
  helper.testFile("/data/vowel.json");
});
