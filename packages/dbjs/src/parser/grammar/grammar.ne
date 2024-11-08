@preprocessor typescript
@include "use.ne"
@include "drop.ne"
@include "create.ne"
@include "select.ne"
@include "insert.ne"
@include "delete.ne"
@include "update.ne"

statement -> use_statement {% (d) => d[0][0] %}
statement -> drop_statement {% (d) => d[0][0] %}
statement -> create_statement {% (d) => d[0][0] %}
statement -> select_statement {% (d) => d[0][0] %}
statement -> insert_statement {% (d) => d[0][0] %}
statement -> delete_statement {% (d) => d[0][0] %}
statement -> update_statement {% (d) => d[0][0] %}