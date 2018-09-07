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

    addCombining(unicode) {
        this._add(unicode, { "type": "combining" });
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

    addConsonant(unicode, manner, place, voiced, lateral) {
        let data = {
            "type": "consonant",
            "place": place,
            "voiced": voiced,
            "lateral": lateral,
            "manner": manner
        };
        this._add(unicode, data);
    }

    addDiacritic(unicode, label, type) {
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
            "supraType": supraType,
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