# Internationl Phonetic Alphabet Parser

A parser for International Phonetic Alphabet (IPA) string as described in [IPA chart][chart].

Return a list of *semantic units* either segmental (*vowel* or *consonnant*) or suprasegmental (tone, prosody, ...). These *semantic units* are simply called hereafter **unit**.

Also return the decomposition of the string into *graphical unit*, called **graphem**. IPA is design in such way that usually, 1 *graphem* = 1 *unit*. But with tone mark 1 *graphem* can carry 2 *units*.

# Install and Use
```
npm install ipa-parser --save
```


```
const parser = require("ipa-parser");
let result = parser.parse("hɛˈləʊ");
```
Result format :
```
{
  'type': string // the transcription type
  'units': [] // an array of IPA unit 
}
```

For decomposition of a string into *graphem* only :
```
const parser = require("ipa-parser");
let array = parser.decompose("[t͡sa:mɯ̟ᵝ");
// array = ["t͡s","a:","m","ɯ̟ᵝ"]
```

# Transcription type
IPA can be used for phonetic and phonemic transcription. The context is indicated by bracket around the sequence.
This indication is optional. If define, fisrt and last character should match.
Transcription type can be `phonetic`, `phonemic`, `prosodic`, `indistinguishable`, `obscured` or `none` if not define.

|input| type     |
|-----| ------   |
|`a`  |`none`    |
|`[a]`|`phonetic`|
|`/a/`|`phonemic`|
|`(a)`|`indistinguishable`|
|`⸨a⸩`|`obscured`|
|`{a}`|`prosodic`|

*Nota* : `((` and `))` are not accepted, `⸨` and `⸩` should be used

# IPA units
The parser return a list of "IPA-unit". These units can be either "segment" or "supra-segmental".
Segment represent the finest sound decomposition and can be either vowel or consonnant. 
Supra-segmental represent information applying on more than one segment like tone or prosody.

*Unit* properties :

| name            | type  |           |
| ---             | ---   | ---       |
| `segment`       |boolean|`true` if the unit is a segment, `false` if supra-segmental|
| `category`      |string | (see *Category* below) |
| `graphem`       |string | The original string or `null` if composed graphem (see below)|
| `simple-graphem`|boolean| True if simple graphem (see below) |

List of *Category* for unit :

|`category`  |`segmental`|description|
| ---        | ---       | ---       |
|`vowel`     | `true`    |           |
|`consonnant`| `true`    |           |
|`stress`    | `false`   | `value` = `primary`, `secondary`|
|`separator` | `false`   | `value` = `major group`, `minor group`, `syllabe break`, `linking`|
|`intonation`| `false`   | `value` = `rise`, `fall`|
|`tone`      | `false`   | See below |

*Nota* : Quantity (also called length) information is not a separate unit but contain in segmental unit (vowel or consonnat) 

## Graphem

A graphem is a single character or a combinasion of characters that describe one segmental or suprasegmental unit. Usually, one *graphem* represent one *unit*. But sometime, especially with tone mark, one graphem can represent 2 differents units (*composed graphem*) because tone is return in a separate suprasegmental unit. 

| ipa  | unicode   | graphem | unit |
| ---  | ---       | ---     | ---  |
| `a`  | 1         | 1       | 1    |
| `ȁ`  | 2         | 1       | 2    |
| `a˩` | 2         | 2       | 2    |
| `t͡s` | 3         | 1       | 1    |

For *composed graphem*, the `graphem` field is define in the first unit and `null` in the second one. The field `composed-graphem` is true for each unit :

*Exemple*
`tȁta˩` will return :

|category  |graphem |composed-graphem|
|---       |---     |---             |
|consonnant| `t`    | `false`        |
|vowel     | `ȁ`    | `true`         |
|tone      | `null` | `true`         |
|consonnant| `t`    | `false`        |
|vowel     | `a`    | `false`        |
|tone      | `˩`    | `false`        |

## Segment : Vowel and Consonnant
Vowel and consonant have common properties :

| name     | type    |           |
| ---      | ---     | ---       |
|`quantity`| object  | see below |
|`syllabic`| boolean |           |
|`voiced`  | boolean |           |

*Vowel* specifics properties :

| name     | type    |           |
| ---      | ---     | ---       |
|`height`  | number  | -3 (open) ... 3 (close) |
|`backness`| number  | -2 (back) ... 2 (front) |
|`round`   | boolean | |

*Consonnant* specifics properties :

| name     | type    |           |
| ---      | ---     | ---       |
| `manner` | string  |       | 
| `place`  | string  |       | 
| `lateral`| boolean |       |

TODO :
 - `base` : the base symbol in IPA (i.e. without diacritic) (?)
 - `coarticulation` : a list of coarticulation

### Quantity 
TODO

### Diphtong, Triphtong
Not define in IPA chart, not supported by this parser.
Combinaison with a tie bar (`a͡ɪ`) or a with a superscript (`aᶦ`) will be reject.

## Tone
Tone are returned either as :
 - an array of number from `1` to `5` like : `[1]` or `[5,3]`
 - a string : `downstep`, `upstep`, `failling`, `rising`

```
{
  'type'  : 'tone',
  'value' : [5, 3]  
}
```

If tone is mark on a segment. It will be returned after this segment `á` will be return as "segment-a" + "high-tone".
*Warning* : the tone is added just after the segment and not at the end of the syllabe or word.

## Stress

Stress are represent with the vertical line `ˈ` (primary) and `ˌ` (secondary).
The unit contain the field `value` that can be `primary`or `secondary`.
"Extra-stress", sometimes write with double line (`ˈˈ`), is not supported and will be return as two primary stress.  

# Invalid input

If the input is not a valid IPA string, throw an error.

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