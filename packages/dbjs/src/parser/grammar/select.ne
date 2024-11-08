@include "base.ne"

@lexer lexer

select_statement -> select_table

select_table -> select _ star _ from_seq {% (d) => ({ 
  type: "SELECT ALL",
  ...d[4],
}) %}

select_table -> select _ columns _ from_seq {% (d) => ({ 
  type: "SELECT", 
  columns: d[2],
  ...d[4],
}) %}

from_seq -> from _ identifier _ where_seq:? {% (d) => ({
  table: d[2][0].value,
  conditions: d[4],
}) %}

columns -> identifier {% (d) => [d[0][0].value] %}

columns -> columns _ comma _ identifier {% (d) => d[0].concat([d[4][0].value]) %}

