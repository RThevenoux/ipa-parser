const VowelBackness = Object.freeze({
  "FRONT": 2,
  "NEAR_FRONT": 1,
  "CENTRAL": 0,
  "NEAR_BACK": -1,
  "BACK": -2
});

const VowelHeight = Object.freeze({
  "CLOSE": 3,
  "NEAR_CLOSE": 2,
  "CLOSE_MID": 1,
  "MID": 0,
  "OPEN_MID": -1,
  "NEAR_OPEN": -2,
  "OPEN": -3
});

module.exports.Height = VowelHeight;
module.exports.Backness = VowelBackness;