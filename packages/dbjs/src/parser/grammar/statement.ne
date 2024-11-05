@include "create.ne"
@include "select.ne"
@include "update.ne"
@include "insert.ne"
@include "using.ne"
@include "delete.ne"
@include "drop.ne"


statement -> create_table_statement {% d => d[0] %}
statement -> create_index_statement {% d => d[0] %}
statement -> select_statement {% d => d[0] %}
statement -> update_statement {% d => d[0] %}
statement -> insert_statement {% d => d[0] %}
statement -> batch_insert_statement {% d => d[0] %}
statement -> using_statement {% d => d[0] %}
statement -> delete_statement {% d => d[0] %}
statement -> drop_statement {% d => d[0] %}