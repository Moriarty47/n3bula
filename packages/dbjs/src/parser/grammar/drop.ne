@include "base.ne"
@lexer lexer

drop_statement -> kw_drop %ws database_name {% d => {
    return{
        "type":"drop",
        "params": d[2]
    }
} %}