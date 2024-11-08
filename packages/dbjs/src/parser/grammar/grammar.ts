// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

import { lexer } from '../lexer';

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = { type: any } | string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "use", "symbols": [{type: "use"}]},
    {"name": "drop", "symbols": [{type: "drop"}]},
    {"name": "create", "symbols": [{type: "create"}]},
    {"name": "database", "symbols": [{type: "database"}]},
    {"name": "table", "symbols": [{type: "table"}]},
    {"name": "index", "symbols": [{type: "index"}]},
    {"name": "on", "symbols": [{type: "on"}]},
    {"name": "select", "symbols": [{type: "select"}]},
    {"name": "from", "symbols": [{type: "from"}]},
    {"name": "where", "symbols": [{type: "where"}]},
    {"name": "insert", "symbols": [{type: "insert"}]},
    {"name": "into", "symbols": [{type: "into"}]},
    {"name": "values", "symbols": [{type: "values"}]},
    {"name": "delete_", "symbols": [{type: "delete_"}]},
    {"name": "update", "symbols": [{type: "update"}]},
    {"name": "set", "symbols": [{type: "set"}]},
    {"name": "and", "symbols": [{type: "and"}]},
    {"name": "or", "symbols": [{type: "or"}]},
    {"name": "identifier", "symbols": [{type: "identifier"}]},
    {"name": "number", "symbols": [{type: "number"}]},
    {"name": "string", "symbols": [{type: "string"}]},
    {"name": "lparen", "symbols": [{type: "lparen"}]},
    {"name": "rparen", "symbols": [{type: "rparen"}]},
    {"name": "lBracket", "symbols": [{type: "lBracket"}]},
    {"name": "rBracket", "symbols": [{type: "rBracket"}]},
    {"name": "lcBracket", "symbols": [{type: "lcBracket"}]},
    {"name": "rcBracket", "symbols": [{type: "rcBracket"}]},
    {"name": "comma", "symbols": [{type: "comma"}]},
    {"name": "dot", "symbols": [{type: "dot"}]},
    {"name": "colon", "symbols": [{type: "colon"}]},
    {"name": "semiColon", "symbols": [{type: "semiColon"}]},
    {"name": "star", "symbols": [{type: "star"}]},
    {"name": "equal", "symbols": [{type: "equal"}]},
    {"name": "unequal", "symbols": [{type: "unequal"}]},
    {"name": "bigger", "symbols": [{type: "bigger"}]},
    {"name": "smaller", "symbols": [{type: "smaller"}]},
    {"name": "biggerEqual", "symbols": [{type: "biggerEqual"}]},
    {"name": "smallerEqual", "symbols": [{type: "smallerEqual"}]},
    {"name": "_", "symbols": [{type: "ws"}]},
    {"name": "where_seq", "symbols": ["where", "_", "condition"], "postprocess": (d) => d[2]},
    {"name": "condition", "symbols": ["condition", "_", "and", "_", "condition"], "postprocess":  (d) => ({
          type: "AND",
          condition: [d[0], d[4]]
        }) },
    {"name": "condition", "symbols": ["condition", "_", "or", "_", "condition"], "postprocess":  (d) => ({
          type: "OR",
          condition: [d[0], d[4]]
        }) },
    {"name": "condition", "symbols": ["identifier", "_", "operators", "_", "number"], "postprocess":  (d) => ({
          type: d[2].type,
          operator: d[2].operator,
          left: d[0][0].value,
          right: d[4][0].value,
        }) },
    {"name": "condition", "symbols": ["identifier", "_", "operators", "_", "string"], "postprocess":  (d) => ({
          type: d[2].type,
          operator: d[2].operator,
          left: d[0][0].value,
          right: d[4][0].value,
        }) },
    {"name": "operators", "symbols": ["equal"], "postprocess": (d) => ({ type: "EUQAL", operator: d[0][0].value })},
    {"name": "operators", "symbols": ["unequal"], "postprocess": (d) => ({ type: "UNEQUAL", operator: d[0][0].value })},
    {"name": "operators", "symbols": ["bigger"], "postprocess": (d) => ({ type: "BIGGER", operator: d[0][0].value })},
    {"name": "operators", "symbols": ["smaller"], "postprocess": (d) => ({ type: "SMALLER", operator: d[0][0].value })},
    {"name": "operators", "symbols": ["biggerEqual"], "postprocess": (d) => ({ type: "BIGGEREQUAL", operator: d[0][0].value })},
    {"name": "operators", "symbols": ["smallerEqual"], "postprocess": (d) => ({ type: "SMALLEREQUAL", operator: d[0][0].value })},
    {"name": "use_statement", "symbols": ["use_seq"]},
    {"name": "use_seq", "symbols": ["use", "_", "identifier"], "postprocess":  (d) => ({
          type: "USE",
          database: d[2][0].value,
        }) },
    {"name": "drop_statement", "symbols": ["drop_seq"]},
    {"name": "drop_seq", "symbols": ["drop", "_", "identifier"], "postprocess":  (d) => ({
          type: "DROP",
          database: d[2][0].value,
        }) },
    {"name": "create_statement", "symbols": ["create_seq"]},
    {"name": "create_seq", "symbols": ["create", "_", "database", "_", "identifier"], "postprocess":  (d) => ({
          type: "CREATE DATABASE",
          database: d[4][0].value,
        }) },
    {"name": "create_seq", "symbols": ["create", "_", "table", "_", "identifier", "_", "lparen", "_", "column_list", "_", "rparen"], "postprocess":  (d) => ({
          type: "CREATE TABLE",
          table: d[4][0].value,
          columns: d[8],
        }) },
    {"name": "column_list", "symbols": ["column"], "postprocess": (d) => [d[0]]},
    {"name": "column_list", "symbols": ["column_list", "_", "comma", "_", "column"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "column", "symbols": ["identifier", "_", "data_type"], "postprocess":  (d) => ({
          column: d[0][0].value,
          ...d[2],
        }) },
    {"name": "data_type", "symbols": [{"literal":"BOOLEAN"}], "postprocess": (d) => ({ data_type: d[0].value })},
    {"name": "data_type", "symbols": [{"literal":"TINYINT"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 1 })},
    {"name": "data_type", "symbols": [{"literal":"SMALLINT"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 2 })},
    {"name": "data_type", "symbols": [{"literal":"MEDIUMINT"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 3 })},
    {"name": "data_type", "symbols": [{"literal":"INT"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 4 })},
    {"name": "data_type", "symbols": [{"literal":"BIGINT"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 8 })},
    {"name": "data_type", "symbols": [{"literal":"DOUBLE"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 8 })},
    {"name": "date_type", "symbols": [{"literal":"YEAR"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 1 })},
    {"name": "date_type", "symbols": [{"literal":"DATE"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 4 })},
    {"name": "date_type", "symbols": [{"literal":"TIME"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 4 })},
    {"name": "date_type", "symbols": [{"literal":"TIMESTAMP"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 4 })},
    {"name": "date_type", "symbols": [{"literal":"DATETIME"}], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: 8 })},
    {"name": "data_type", "symbols": [{"literal":"CHAR"}, "lparen", "number", "rparen"], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: d[2][0].value, max_bytes: 0xff })},
    {"name": "data_type", "symbols": [{"literal":"VARCHAR"}, "lparen", "number", "rparen"], "postprocess": (d) => ({ data_type: d[0].value, data_bytes: d[2][0].value, max_bytes: 0xffff })},
    {"name": "data_type", "symbols": [{"literal":"TINYBLOB"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xff })},
    {"name": "data_type", "symbols": [{"literal":"TINYTEXT"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xff })},
    {"name": "data_type", "symbols": [{"literal":"BLOB"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffff })},
    {"name": "data_type", "symbols": [{"literal":"TEXT"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffff })},
    {"name": "data_type", "symbols": [{"literal":"MEDIUMBLOB"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffffff })},
    {"name": "data_type", "symbols": [{"literal":"MEDIUMTEXT"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffffff })},
    {"name": "data_type", "symbols": [{"literal":"MEDIUMTEXT"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffffff })},
    {"name": "data_type", "symbols": [{"literal":"LONGBLOB"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffffffff })},
    {"name": "data_type", "symbols": [{"literal":"LONGTEXT"}], "postprocess": (d) => ({ data_type: d[0].value, max_bytes: 0xffffffff })},
    {"name": "create_statement", "symbols": ["create_index"]},
    {"name": "create_index", "symbols": ["create", "_", "index", "_", "identifier", "_", "on", "_", "identifier", "_", "lparen", "identifier", "rparen"], "postprocess":  (d) => ({
          type: "CREATE INDEX",
          index_name: d[4][0].value,
          table_name: d[8][0].value,
          column: d[11][0].value,
        }) },
    {"name": "select_statement", "symbols": ["select_table"]},
    {"name": "select_table", "symbols": ["select", "_", "star", "_", "from_seq"], "postprocess":  (d) => ({ 
          type: "SELECT ALL",
          ...d[4],
        }) },
    {"name": "select_table", "symbols": ["select", "_", "columns", "_", "from_seq"], "postprocess":  (d) => ({ 
          type: "SELECT", 
          columns: d[2],
          ...d[4],
        }) },
    {"name": "from_seq$ebnf$1", "symbols": ["where_seq"], "postprocess": id},
    {"name": "from_seq$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "from_seq", "symbols": ["from", "_", "identifier", "_", "from_seq$ebnf$1"], "postprocess":  (d) => ({
          table: d[2][0].value,
          conditions: d[4],
        }) },
    {"name": "columns", "symbols": ["identifier"], "postprocess": (d) => [d[0][0].value]},
    {"name": "columns", "symbols": ["columns", "_", "comma", "_", "identifier"], "postprocess": (d) => d[0].concat([d[4][0].value])},
    {"name": "insert_statement", "symbols": ["insert"]},
    {"name": "insert$ebnf$1", "symbols": ["columns"], "postprocess": id},
    {"name": "insert$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "insert", "symbols": ["insert", "_", "into", "_", "identifier", "_", "insert$ebnf$1", "_", "values", "_", "value_list"], "postprocess":  (d) => ({
          type: "INSERT",
          table: d[4][0].value,
          columns: d[6],
          values: d[10]
        }) },
    {"name": "columns", "symbols": ["lparen", "_", "column_list", "_", "rparen"], "postprocess": (d) => d[2]},
    {"name": "column_list", "symbols": ["identifier"], "postprocess": (d) => [d[0][0].value]},
    {"name": "column_list", "symbols": ["column_list", "_", "comma", "_", "identifier"], "postprocess": (d) => d[0].concat([d[4][0].value])},
    {"name": "value_list", "symbols": ["value_group"], "postprocess": (d) => [d[0]]},
    {"name": "value_list", "symbols": ["value_list", "_", "comma", "_", "value_group"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "value_group", "symbols": ["lparen", "_", "values", "_", "rparen"], "postprocess": (d) => d[2]},
    {"name": "values", "symbols": ["value"], "postprocess": (d) => [d[0]]},
    {"name": "values", "symbols": ["values", "_", "comma", "_", "value"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "value", "symbols": ["string"], "postprocess": (d) => d[0][0].value},
    {"name": "value", "symbols": ["number"], "postprocess": (d) => d[0][0].value},
    {"name": "value", "symbols": ["identifier"], "postprocess": (d) => d[0][0].value},
    {"name": "delete_statement", "symbols": ["delete_seq"]},
    {"name": "delete_seq$ebnf$1", "symbols": ["where_seq"], "postprocess": id},
    {"name": "delete_seq$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "delete_seq", "symbols": ["delete_", "_", "from", "_", "identifier", "_", "delete_seq$ebnf$1"], "postprocess":  (d) => ({
          type: "DELETE",
          table: d[4][0].value,
          conditions: d[6],
        }) },
    {"name": "update_statement", "symbols": ["update_seq"]},
    {"name": "update_seq$ebnf$1", "symbols": ["where_seq"], "postprocess": id},
    {"name": "update_seq$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "update_seq", "symbols": ["update", "_", "identifier", "_", "set", "_", "expression_seq", "_", "update_seq$ebnf$1"], "postprocess":  (d) => ({
          type: "UPDATE",
          table: d[2][0].value,
          expression: d[6],
          conditions: d[8],
        }) },
    {"name": "expression_seq", "symbols": ["expression"], "postprocess": (d) => [d[0]]},
    {"name": "expression_seq", "symbols": ["expression_seq", "_", "comma", "_", "expression"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "expression", "symbols": ["identifier", "_", "equal", "_", "number"], "postprocess":  (d) => ({
          column: d[0][0].value,
          value: d[4][0].value,
        }) },
    {"name": "expression", "symbols": ["identifier", "_", "equal", "_", "string"], "postprocess":  (d) => ({
          column: d[0][0].value,
          value: d[4][0].value,
        }) },
    {"name": "expression", "symbols": ["identifier", "_", "equal", "_", "identifier"], "postprocess":  (d) => ({
          column: d[0][0].value,
          value: d[4][0].value,
        }) },
    {"name": "statement", "symbols": ["use_statement"], "postprocess": (d) => d[0][0]},
    {"name": "statement", "symbols": ["drop_statement"], "postprocess": (d) => d[0][0]},
    {"name": "statement", "symbols": ["create_statement"], "postprocess": (d) => d[0][0]},
    {"name": "statement", "symbols": ["select_statement"], "postprocess": (d) => d[0][0]},
    {"name": "statement", "symbols": ["insert_statement"], "postprocess": (d) => d[0][0]},
    {"name": "statement", "symbols": ["delete_statement"], "postprocess": (d) => d[0][0]},
    {"name": "statement", "symbols": ["update_statement"], "postprocess": (d) => d[0][0]}
  ],
  ParserStart: "statement",
};

export default grammar;
