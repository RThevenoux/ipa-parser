var IpaCharacterError = require("./error/ipa-character-error");

module.exports = class Mapper {

    constructor() {
        this.map = {};
    }

    _add(unicode, ipa) {
        let previous = this.map[unicode];
        if (previous) {
            throw new Error("duplicate data for character " + unicode + " . Previous " + JSON.stringify(previous));
        }
        this.map[unicode] = ipa;
    }

    addTieBar(unicode) {
        this._add(unicode, { "type": "tie-bar" });
    }

    addVowel(unicode, height, backness, rounded) {
        let data = {
            "type": "vowel",
            "height": height,
            "backness": backness,
            "rounded": rounded,
        }
        this._add(unicode, data);
    }

    addConsonant(unicode, manner, places, voiced, lateral, nasal) {
        let data = {
            "type": "consonant",
            "places": places,
            "voiced": voiced,
            "lateral": lateral,
            "manner": manner,
            "nasal": nasal
        };
        this._add(unicode, data);
    }

    addDiacritic(unicode, type, label) {
        let data = {
            "type": "diacritic",
            "diacritic": {
                "type": type,
                "label": label
            }
        };
        this._add(unicode, data);
    }

    addBrackets(bracketType, unicodeStart, unicodeEnd) {
        if (unicodeStart == unicodeEnd) {
            let data = {
                "type": "bracket",
                "start": bracketType,
                "end": bracketType
            };
            this._add(unicodeStart, data);
        } else {
            this._add(unicodeStart, { "type": "bracket", "start": bracketType });
            this._add(unicodeEnd, { "type": "bracket", "end": bracketType });
        }
    }

    addSupra(unicode, supraType, label) {
        let data = {
            "type": "supra",
            "category": supraType,
            "value": label
        };
        this._add(unicode, data);
    }

    addToneLetter(unicode, label) {
        let data = {
            "type": "tone-letter",
            "label": label
        };
        this._add(unicode, data);
    }

    get(unicode) {
        if (/\s/.test(unicode)) {
            return { "type": "spacing" };
        }

        let data = this.map[unicode];
        if (!data) {
            throw new IpaCharacterError(unicode);
        }
        return data;
    }
}