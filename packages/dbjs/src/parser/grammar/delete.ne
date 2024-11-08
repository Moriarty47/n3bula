@include "base.ne"

@lexer lexer

delete_statement -> delete_seq

delete_seq -> delete_ _ from _ identifier _ where_seq:? {% (d) => ({
  type: "DELETE",
  table: d[4][0].value,
  conditions: d[6],
}) %}

