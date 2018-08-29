# Normalize

- separate diacritic. Example : `ã` => `a` + `~`
  - EXCEPTION : `ç`. The only base character with a diacritic
- use a defaut position for diacritic : `͜ ` => `⁀`
- separate ligature. Example `ʦ` => `t͡s`
- replace common alternative character by the official one :
  - `g` => `ɡ`
  - `:` => `ː`

# Pseudo Syntax

IPA = s* ( wType | woType )
s = any spacing or line break
wType = OB unitSeq CB s* // OB and CB should match
woType = unitSeq
unitSeq = (unit s* )*
OB = open bracket CB = close bracket
unit = vowel | consonnant | stress | separator | intonation | tone
seq = unit+
unit = (pre-seg)? segment (post-seg)? (separator)? //NON certain supra-seg sont ni pre-seg, ni post-seg
vowel = v (_ v)*
v = A (d)*
consonnant = c_simple | c_composed
c_simple = T (d)*
c_composed = T1 (d)* _ (d)* T2 (d)*
tone 

# Multi layer event based
1 - unicode to concept
2 - manage bracket
3 - graphem  

? spacing