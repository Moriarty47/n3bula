@include "base.ne"

@lexer lexer

insert_statement -> insert

insert -> insert _ into _ identifier _ columns:? _ values _ value_list {% (d) => ({
  type: "INSERT",
  table: d[4][0].value,
  columns: d[6],
  values: d[10]
}) %}

columns -> lparen _ column_list _ rparen {% (d) => d[2] %}

column_list -> identifier {% (d) => [d[0][0].value] %}

column_list -> column_list _ comma _ identifier {% (d) => d[0].concat([d[4][0].value]) %}

value_list -> value_group {% (d) => [d[0]] %}

value_list -> value_list _ comma _ value_group {% (d) => d[0].concat([d[4]]) %}

value_group -> lparen _ values _ rparen {% (d) => d[2] %}

values -> value {% (d) => [d[0]] %}

values -> values _ comma _ value {% (d) => d[0].concat([d[4]]) %}

value -> 
    string {% (d) => d[0][0].value %}
  | number {% (d) => d[0][0].value %}
  | identifier {% (d) => d[0][0].value %}
