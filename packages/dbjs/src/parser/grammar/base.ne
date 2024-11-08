@{%
import { lexer } from '../lexer';
%}

@builtin "whitespace.ne"
@lexer lexer

use -> %use
drop -> %drop
create -> %create
database -> %database
table -> %table
index -> %index
on -> %on
select -> %select
from -> %from
where -> %where
insert -> %insert
into -> %into
values -> %values
delete_ -> %delete_
update -> %update
set -> %set
and -> %and
or -> %or
identifier -> %identifier
number -> %number
string -> %string
lparen -> %lparen
rparen -> %rparen
lBracket -> %lBracket
rBracket -> %rBracket
lcBracket -> %lcBracket
rcBracket -> %rcBracket
comma -> %comma
dot -> %dot
colon -> %colon
semiColon -> %semiColon
star -> %star
equal -> %equal
unequal -> %unequal
bigger -> %bigger
smaller -> %smaller
biggerEqual -> %biggerEqual
smallerEqual -> %smallerEqual
_ -> %ws


where_seq -> where _ condition {% (d) => d[2] %}

condition -> condition _ and _ condition {% (d) => ({
  type: "AND",
  condition: [d[0], d[4]]
}) %}

condition -> condition _ or _ condition {% (d) => ({
  type: "OR",
  condition: [d[0], d[4]]
}) %}

condition -> identifier _ operators _ number {% (d) => ({
  type: d[2].type,
  operator: d[2].operator,
  left: d[0][0].value,
  right: d[4][0].value,
}) %}

condition -> identifier _ operators _ string {% (d) => ({
  type: d[2].type,
  operator: d[2].operator,
  left: d[0][0].value,
  right: d[4][0].value,
}) %}

operators -> 
    equal {% (d) => ({ type: "EUQAL", operator: d[0][0].value }) %}
  | unequal {% (d) => ({ type: "UNEQUAL", operator: d[0][0].value }) %}
  | bigger {% (d) => ({ type: "BIGGER", operator: d[0][0].value }) %}
  | smaller {% (d) => ({ type: "SMALLER", operator: d[0][0].value }) %}
  | biggerEqual {% (d) => ({ type: "BIGGEREQUAL", operator: d[0][0].value }) %}
  | smallerEqual {% (d) => ({ type: "SMALLEREQUAL", operator: d[0][0].value }) %}
