@include "base.ne"

@lexer lexer

drop_statement -> drop_seq

drop_seq -> drop _ identifier {% (d) => ({
  type: "DROP",
  database: d[2][0].value,
}) %}

