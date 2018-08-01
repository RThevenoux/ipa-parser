var Ipa = require("../main/ipa");

runTest();

function runTest() {

    let tests = [test_normalize, testParsePhonemes];
    let parser = new Ipa().getParser()

    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        let result = test(parser);
        console.log(result);
    }
};

function test_normalize(parser) {
    let testCases = {
        "a": "a",
        "\u00E3": "a\u0303",// LATIN SMALL LETTER A WITH TILDE > a + tilde
        "abcdef": "abcdef",
        "g": '\u0261',
        "ʦ": "t\u0361s",
        "tˢ": "t\u0361s",
        "çc\u0327ç": "ççç",// LATIN SMALL LETTER C WITH CEDILLA
    }

    console.log("'IpaParser._normalize()' START")
    let errorCount = 0;
    let totalCount = 0;
    for (let key in testCases) {
        let expected = testCases[key];
        let result = parser._normalize(key);
        if (result !== expected) {
            errorCount++;
            console.log("  Error on '" + key + "'");
            let unicode = "";
            for (let i = 0; i < result.length; i++) {
                unicode += "\\u" + result.charCodeAt(i).toString(16);
            }
            console.log("  - expected '" + expected + "', obtain '" + result + '" > ' + unicode);
        }
        totalCount++;
    }
    if (errorCount == 0) {
        return " => IpaParser._normalize() OK";
    } else {
        return " => IpaParser._normalize() Error: " + errorCount + "/" + totalCount;
    }
};

function testParsePhonemes(parser) {
    // format : 
    // testCase = [ input , [expectedPhoneme] , testLabel ]
    // expectedPhoneme = [ base, nasal]
    let testCases = [
        ["a", [['a', false]], "Just 'a'"],
        ["\u00E3", [['a', true]], "LATIN SMALL LETTER A WITH TILDE"],
        ["a\u0303", [['a', true]], " a + tilde"],
        ["ab", [['a', false], ['b', false]], " a + b"],
        ["a\u00E3a\u0303a", [['a', false], ['a', true], ['a', true], ['a', false]], " a | a-tilde (1 unicode) | a + tilde (2 unicode) "],
        ["ʦ", [['ts', false]], 'ligature']
    ];

    let errorCount = 0;
    let totalCount = 0;

    console.log("'IpaParser.parsePhonemes()'")
    for (let i = 0; i < testCases.length; i++) {
        let testCase = testCases[i];

        let input = testCase[0];
        let expectedPhonemes = testCase[1];
        let testLabel = testCase[2];

        let phonemes = parser.parsePhonemes(input);
        if (phonemes.length !== expectedPhonemes.length) {
            errorCount++;
            console.log("  Error on test #" + i + " " + testLabel);
            console.log("  - expected length: " + expectedPhonemes.length + ", obtain: " + phonemes.length);
        } else {
            let error = false;
            for (let j = 0; j < phonemes.length; j++) {
                let phoneme = phonemes[j];
                let expectedValues = expectedPhonemes[j];

                let base = phoneme.base;
                let expectedBase = expectedValues[0];
                if (base !== expectedBase) {
                    error = true;
                    console.log("  Error on test #" + i + " " + testLabel);
                    console.log("  - expected base: " + expectedBase + ", obtain: " + base);
                }

                let nasal = phoneme.coarticulation.includes("Nasalized");
                let expectedNasal = expectedValues[1];
                if (!nasal != !expectedNasal) {
                    error = true;
                    console.log("  Error on test #" + i + " " + testLabel);
                    console.log("  - expected nasal: " + expectedNasal + ", obtain: " + nasal);
                }
            }
            if (error) {
                errorCount++;
            }
        }
        totalCount++;
    }
    
    if (errorCount == 0) {
        return " => IpaParser.parsePhonemes() OK";
    } else {
        return " => IpaParser.parsePhonemes() Error: " + errorCount + "/" + totalCount;
    }
};

