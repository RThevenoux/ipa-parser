#TODO
- ESLint
- Migrate to ES6 module
- Github page

# Normalize

- separate diacritic. Example : `ã` => `a` + `~`
  - EXCEPTION : `ç`. The only base character with a diacritic
- use a defaut position for diacritic : `͜ ` => `⁀`
- separate ligature. Example `ʦ` => `t͡s`
- replace common alternative character by the official one :
  - `g` => `ɡ`
  - `:` => `ː`

# Multi layer event based
1 - unicode to concept
2 - manage bracket
3 - graphem  

? spacing

# Event matrix / State machine

Event :
- s : space
- tl : tone letter
- tm : tone mark
- tg : general tone
- st : stress
- sp : separator
- d : diacritic
- v : vowel
- c : consonne
- tb : tie bar

- `<` : open unit
- `-` : continue unit
- `>` : close unit
- `!` : open & close unit

| State | s   | tl  | tm  | tg  | st  | sp  |  d  |  v  |  c  | tb  |
| ---   | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0     | 0   | <TL | Err | !0  | !0  | !0  | Err | <V  | <C  | Err |
| TL    | > 0 | -TL | Err | >!0 | >!0 | >!0 | Err | ><V | ><C | Err |
| V     | > 0 | ><TL| -V  | >!0 | >!0 | >!0 | -V  | ><V | ><C | Err |
| C     | > 0 | ><TL| -C  | >!0 | >!0 | >!0 | -C  | ><V | ><C |PT(C)|
| PT    | Err | Err | -PT | Err | Err | Err | -PT | Err | -C  | Err |

=>
 - s, tl, [tm/d], [tg,st,sp], v, c, tb