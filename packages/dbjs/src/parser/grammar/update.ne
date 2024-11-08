@include "base.ne"

@lexer lexer

update_statement -> update_seq

update_seq -> update _ identifier _ set _ expression_seq _ where_seq:? {% (d) => ({
  type: "UPDATE",
  table: d[2][0].value,
  expression: d[6],
  conditions: d[8],
}) %}

expression_seq -> expression {% (d) => [d[0]] %}

expression_seq -> expression_seq _ comma _ expression {% (d) => d[0].concat([d[4]]) %}

expression -> 
    identifier _ equal _ number {% (d) => ({
      column: d[0][0].value,
      value: d[4][0].value,
    }) %}
  | identifier _ equal _ string {% (d) => ({
      column: d[0][0].value,
      value: d[4][0].value,
    }) %}
  | identifier _ equal _ identifier {% (d) => ({
      column: d[0][0].value,
      value: d[4][0].value,
    }) %}