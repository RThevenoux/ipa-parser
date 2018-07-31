module.exports = class IpaSymbol {

    static combining(unicode) {
        return new IpaSymbol("combining", unicode);
    }

    static vowel(unicode, height, backness, rounded) {
        let symbol = new IpaSymbol("vowel", unicode);
        symbol.height = height;
        symbol.backness = backness;
        symbol.rounded = rounded;
        return symbol;
    }

    static consonant(unicode, manner, place, voiced, lateral) {
        let symbol = new IpaSymbol("consonant", unicode);
        symbol.manner = manner;
        symbol.place = place;
        symbol.voiced = voiced;
        symbol.lateral = lateral;
        return symbol;
    }

    static diacritic(unicode, label, type) {
        let symbol = new IpaSymbol("diacritic", unicode);
        symbol.ipa = label;
        symbol.diacritic = {
            "type": type,
            "label": label
        }
        return symbol;
    }

    constructor(type, unicode) {
        this.type = type;
        this.base = unicode;
    }
}