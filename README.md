# Internationl Phonetic Alphabet Parser

A parser for International Phonetic Alphabet (IPA) string as described in [IPA chart][chart].

Return a list of *semantic units* either segmental (*vowel* or *consonant*) or suprasegmental (tone, prosody, ...). These *semantic units* are simply called hereafter **unit**.

# Install and Use
``` 
npm install ipa-parser --save
```

``` js
const parser = require("ipa-parser").parser;
let result = parser.parse("/hɛˈləʊ/");
```

Result format :
``` js
{
  'type': string // the transcription type
  'units': [] // an array of IPA unit 
}
```

# Transcription type
IPA can be used for phonetic and phonemic transcription. The context is indicated by bracket around the sequence.
This indication is optional. If define, fisrt and last character should match.
Transcription type can be `phonetic`, `phonemic`, `prosodic`, `indistinguishable`, `obscured` or `none` if not define.

|input| type     |
|:---:| ------   |
|`a`  |`none`    |
|`[a]`|`phonetic`|
|`/a/`|`phonemic`|
|`(a)`|`indistinguishable`|
|`⸨a⸩`|`obscured`|
|`{a}`|`prosodic`|

*Nota* : `((` and `))` are not accepted, `⸨` and `⸩` should be used

# IPA units
The parser return a list of "IPA-unit". These units can be either "segment" or "supra-segmental".
Segment represent the finest sound decomposition and can be either vowel or consonant. 
Supra-segmental represent information applying on more than one segment like tone or prosody.

*Unit* properties :

| name            | type  |           |
| ---             | ---   | ---       |
| `segment`       |boolean|`true` if the unit is a segment, `false` if supra-segmental|
| `category`      |string | (see *Category* below) |

List of *Category* for unit :

|`category`  |`segmental`|description|
| ---        | ---       | ---       |
|`vowel`     | `true`    | /1        |
|`consonant` | `true`    | /2        |
|`tone`      | `false`   | /3        |
|`tone-step` | `false`   | /4        |
|`intonation`| `false`   | /4        |
|`stress`    | `false`   | /4        |
|`separator` | `false`   | /4        |

*Nota* : Quantity (also called length) information is not a separate unit but contain in segmental unit (vowel or consonnat) 

## Segment : Vowel and Consonant
Vowel and consonant have common properties :

| name     | type    |           |
| ---      | ---     | ---       |
|`quantity`| String  | `extra-short`, `short`, `half-long`, `long` or `extra-long` |
|`syllabic`| boolean |           |
|`voicing` | object  | see below |
|`nasal`   | boolean |           |

*Vowel* specifics properties :

| name                | type    |           |
| ---                 | ---     | ---       |
|`height`             | number  | -3 (open) ... 3 (close) |
|`backness`           | number  | -2 (back) ... 2 (front) |
|`rounded`            | boolean | |
|`roundednessModifier`| String  | `none`, `more` or `less`|
|`rhotacized`         | boolean | |
|`tongueRoot`         | String  | `neutral`, `advanced` or `retracted`|

*Consonant* specifics properties :

| name          | type     |                    |
| ---           | ---      | ---                |
| `manner`      | String   | `stop`, `fricative`, `approximant`, `flap`, `tapped-fricative`, `trill`, `trilled-fricative` or `vowel`|
| `secondary`   | String   | `none`, `bilabial`, `palatal`, `velar` or `pharyngeal`| 
| `places`      | Arrays  of String | `bilabial`, `labiodental`, `dental`, `alveolar`, `postalveolar`, `retroflex`, `alveopalatal`, `palatal`, `velar`, `uvular`, `pharyngal`, `epiglottal` and `glottal` |
| `coronalType` | String   | `unspecified`,`laminal` or `apical` |
| `lateral`     | boolean  |                    |
| `ejective`    | boolean  |                    |
| `release`     | String   |`unaspirated`, `aspirated`, `nasal-release`, `lateral-release` or `no-audible-release`|

### Voicing
| name      | values    |
|---        |---        |
|`voiced`   | boolean   |
|`phonation`|`voiceless`, `modal`, `breathy` or `creaky`|

### Diphtong, Triphtong
Not define in IPA chart, not supported by this parser.
Combinaison with a tie bar (`a͡ɪ`) or a with a superscript (`aᶦ`) will be reject.

## Tone
IPA define two way to describe tones :
 - One tone mark on a segmental letter, like `é`. The *tone-unit* wll be returned just after the *segmental-unit* (**warning :** *tone-unit* may not be at the end of the syllabe or word).
 - One or many tone letters, describing visually the tone : like `e˦˨˥`. One *tone-unit* will be returned for the group of tone letters.
*Warning* : 

In both way, the unit will contain two informations :
 - `name` : the name of the accent. If a tone letters group do not matches a tone define by IPA, the name will be `other`.
 - `heights` : an array of number describing the differents highs of the accent. `1` is the lowest and `5` the highest tone.
If a mark and tones letters describe the same accent, they will arrive return the same unit (same *name* and same *highs*).

|Mark|Letters|`name`      |`heights`|Mark|Letters|`name`           |`heights`  |
|:--:|:---:  | ---        |---      |:--:|:---:  | ---             | ---       |
| e̋  | ˥     |`extra-high`|`[5]`    | ě  | ˩˥     | `rising`        |`[1,5]`    |
| é  | ˦     |`high`      |`[4]`    | ê  | ˥˩     | `falling`       |`[5,1]`    |
| ē  | ˧     |`mid`       |`[3]`    | e᷄  | ˦˥     | `high-rising`   |`[4,5]`    |
| è  | ˨     |`low`       |`[2]`    | e᷅  | ˩˨     | `low-rising`    |`[1,2]`    |
| ȅ  | ˩     |`extra-low` |`[1]`    | e᷇  | ˥˦     | `high-falling`  |`[5,4]`    |
|    |       |            |         | e᷆  | ˧˨     | `low-falling`   |`[2,1]`    |
|    |       |            |         | e᷈  | ˧˦˧     | `rising-falling`|`[3,4,3]`  |
|    |       |            |         | e᷉  | ˧˨˧     | `falling-rising`|`[3,2,3]`  |

__Examples__

_Example 1_ : `̌ ` or `˩˥`
``` json
{
    "category": "tone",
    "segment": false,
    "name":"rising",
    "highs":[1,5]
}
```
_Example 2_ : `˧˦˩` 
``` json 
{
    "category": "tone",
    "segment": false,
    "name":"other",
    "highs":[3,4,1]
}
```

## Intonation, Tone-Step, Stress and Separator

Execpt *tone* and *quantity*, all other supra-segmental information will be returned with the same format :
- `category`: identifie the category of the supra-segmental 
- `value`   : a string describing the information in the category 

| character | IPA                           | `category`  | `value`           |
| :---:     | ---                           | ---         | ---               |
| .         | Syllable break                | `separator` | `syllable-break`  |
| ‿         | Linking (absence of a break) | `separator` | `linking`         |  
| \|        | Minor (foot) group            | `separator` | `minor-group`     |
| ‖         | Major (intonation) group      | `separator` | `major-group`     |
| ˈ         | Primary stress                | `stress`    | `primary-stress`  |
| ˌ         | Secondary stress              | `stress`    | `secondary-stress`|
| ꜜ         | Downstep                      | `tone-step` | `downstep`        |
| ꜛ         | Upstep                        | `tone-step` | `upstep`          |
| ↗         | Global rise                   | `intonation`| `global-rise`     |
| ↘         | Global fall                   | `intonation`| `global-fall`     |

*Nota* : "Extra-stress", sometimes write with double line (`ˈˈ`), is not supported and will be return as two *primary stress*.

__Example__
``` json
{
    "category": "separator",
    "segment": false,
    "value": "syllable"
}
```

# Invalid input

If the input is not a valid IPA string, throw an error.

- `IpaCharacterError`
- `IpaSyntaxError`

# Discussion


## Segment, Phone, Phoneme
Phone represent a speech decomposition and are used in phonetic transcription. 
Phoneme represent a disctinctive sound for a given language and are used for phonemic transcription.

The same symbol are used in IPA for phonetic and phonemic trancription. 
This parser will return the narrower description for one symbole as described in [unicode]

ex: `n` could represent a `dental`, `alveolar` or `postalveolar`. The parser will return a description with `alveolar`

# Source

IPA chart : [chart]
IPA symbol encoding : [unicode]

[chart]: https://en.wikipedia.org/wiki/International_Phonetic_Alphabet_chart
[unicode]: https://en.wikipedia.org/wiki/Phonetic_symbols_in_Unicode#From_IPA_to_Unicode
[unicode-2]: http://www.internationalphoneticalphabet.org/ipa-charts/ipa-symbols-with-unicode-decimal-and-hex-codes/