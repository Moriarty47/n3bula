@include "base.ne"

@lexer lexer

use_statement -> use_seq

use_seq -> use _ identifier {% (d) => ({
  type: "USE",
  database: d[2][0].value,
}) %}

