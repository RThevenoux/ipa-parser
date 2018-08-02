# Internationl Phonetic Alphabet Parser

A tool that can parse a valid International Phonetic Alphabet (IPA) string and return a list of phonemes.

## Install

-- TODO --

## Usage
```
var ipa = require("ipa-parser");
var parser = ipa.getParser();
var result = parser.parsePhonemes("hɛˈləʊ");
```

## Concept

- Normalize a string (see below)
- Detect IPA Symbol (1 unicode character = 1 IPA Symbol)
- Combine IPA Symbol to make Phoneme (1 base Symbol + [0-n] diacritic symbol)

### Phoneme

Each phoneme has the followong properties :
 - `type` : `vowel` or `consonant`
 - `base` : the base symbol in IPA (i.e. without diacritic)
 - `syllabic` : boolean value. `true` if syllabic (i.e. a vowel or a syllabic consonant)
 - `voiced` : boolean value.
 - `quantity` : an Object representing the length of this phonemes. (See below)
 - `coarticulation` : a list of coarticulation

 Vowel phoneme has :
 - `height` : number value [-3,3]. See VowelPhoneme.Height.
 - `backness` : number value [-2,2]. See VowelPhoneme.Backness.
 - `round` : boolean value.

 Consonant phoneme has :
 - `place` : string.
 - `manner` : string.
 - `lateral` : boolean value

### Normalize

- separate diacritic. Example : `ã` => `a` + `~`
  - EXCEPTION : `ç`. The only base character with a diacritic
- use a defaut position for diacritic : `͜ ` => `⁀`
- separate ligature. Example `ʦ` => `t͡s`
- replace common alternative character by the official one :
  - `g` => `ɡ`
  - `:` => `ː`

### Quantity
*TODO*