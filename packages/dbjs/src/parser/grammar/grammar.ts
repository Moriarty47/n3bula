// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var create: any;
declare var index: any;
declare var table: any;
declare var select: any;
declare var where: any;
declare var update: any;
declare var insert: any;
declare var using: any;
declare var batch: any;
declare var on: any;
declare var drop: any;
declare var alter: any;
declare var from: any;
declare var delete_: any;
declare var word: any;
declare var quotationWord: any;
declare var quotationWordNumber: any;
declare var comma: any;
declare var ws: any;
declare var lBracket: any;
declare var rBracket: any;
declare var equal: any;
declare var bigger: any;
declare var smaller: any;
declare var biggerEqual: any;
declare var smallerEqual: any;
declare var like: any;
declare var and: any;
declare var set: any;
declare var ws: any;
declare var asterisk: any;
declare var ws: any;
declare var comma: any;
declare var equal: any;
declare var ws: any;
declare var lBracket: any;
declare var rBracket: any;
declare var comma: any;
declare var lcBracket: any;
declare var rcBracket: any;
declare var colon: any;
declare var number: any;
declare var ws: any;
declare var ws: any;
declare var ws: any;

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

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "kw_create", "symbols": [(lexer.has("create") ? {type: "create"} : create)]},
    {"name": "kw_index", "symbols": [(lexer.has("index") ? {type: "index"} : index)]},
    {"name": "kw_table", "symbols": [(lexer.has("table") ? {type: "table"} : table)]},
    {"name": "kw_select", "symbols": [(lexer.has("select") ? {type: "select"} : select)]},
    {"name": "kw_where", "symbols": [(lexer.has("where") ? {type: "where"} : where)]},
    {"name": "kw_update", "symbols": [(lexer.has("update") ? {type: "update"} : update)]},
    {"name": "kw_insert", "symbols": [(lexer.has("insert") ? {type: "insert"} : insert)]},
    {"name": "kw_using", "symbols": [(lexer.has("using") ? {type: "using"} : using)]},
    {"name": "kw_batch", "symbols": [(lexer.has("batch") ? {type: "batch"} : batch)]},
    {"name": "kw_on", "symbols": [(lexer.has("on") ? {type: "on"} : on)]},
    {"name": "kw_drop", "symbols": [(lexer.has("drop") ? {type: "drop"} : drop)]},
    {"name": "kw_alter", "symbols": [(lexer.has("alter") ? {type: "alter"} : alter)]},
    {"name": "kw_from", "symbols": [(lexer.has("from") ? {type: "from"} : from)]},
    {"name": "kw_delete", "symbols": [(lexer.has("delete_") ? {type: "delete_"} : delete_)]},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": d => d[0].value},
    {"name": "word", "symbols": [(lexer.has("quotationWord") ? {type: "quotationWord"} : quotationWord)], "postprocess": d => d[0].value.replaceAll('"', '')},
    {"name": "word", "symbols": [(lexer.has("quotationWordNumber") ? {type: "quotationWordNumber"} : quotationWordNumber)], "postprocess": d => d[0].value.replaceAll('"', '')},
    {"name": "column_name_array", "symbols": ["column_name"], "postprocess": d => [d[0]]},
    {"name": "column_name_array", "symbols": ["column_name_array", (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("ws") ? {type: "ws"} : ws), "column_name"], "postprocess":  d =>{ 
            let array = d[0];
        
            array.push(d[3])
        
            return array
        } },
    {"name": "column_name_array", "symbols": ["column_name_array", (lexer.has("ws") ? {type: "ws"} : ws), "column_name"], "postprocess":  d =>{ 
            let array = d[0];
        
            array.push(d[2])
        
            return array
        } },
    {"name": "column_name_array", "symbols": [(lexer.has("lBracket") ? {type: "lBracket"} : lBracket), "column_name_array", (lexer.has("rBracket") ? {type: "rBracket"} : rBracket)], "postprocess": d =>  d[1]},
    {"name": "table_name", "symbols": ["word"], "postprocess": d => d[0]},
    {"name": "index_name", "symbols": ["word"], "postprocess": d => d[0]},
    {"name": "column_name", "symbols": ["word"], "postprocess": d => d[0]},
    {"name": "database_name", "symbols": ["word"], "postprocess": d => d[0]},
    {"name": "operator", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal)], "postprocess": d => "equal"},
    {"name": "operator", "symbols": [(lexer.has("bigger") ? {type: "bigger"} : bigger)], "postprocess": d => "bigger"},
    {"name": "operator", "symbols": [(lexer.has("smaller") ? {type: "smaller"} : smaller)], "postprocess": d => "smaller"},
    {"name": "operator", "symbols": [(lexer.has("biggerEqual") ? {type: "biggerEqual"} : biggerEqual)], "postprocess": d => "biggerEqual"},
    {"name": "operator", "symbols": [(lexer.has("smallerEqual") ? {type: "smallerEqual"} : smallerEqual)], "postprocess": d => "smallerEqual"},
    {"name": "operator", "symbols": [(lexer.has("like") ? {type: "like"} : like)], "postprocess": d => "like"},
    {"name": "and", "symbols": [(lexer.has("and") ? {type: "and"} : and)]},
    {"name": "set", "symbols": [(lexer.has("set") ? {type: "set"} : set)]},
    {"name": "create_table_statement", "symbols": ["kw_create", (lexer.has("ws") ? {type: "ws"} : ws), "kw_table", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "column_name_array"], "postprocess":  d => {
            return{
                "type":"create table",
                "params":{
                    "columns" : d[6],
                    "table": d[4]
                }
            }
        } },
    {"name": "create_index_statement", "symbols": ["kw_create", (lexer.has("ws") ? {type: "ws"} : ws), "kw_index", (lexer.has("ws") ? {type: "ws"} : ws), "index_name", (lexer.has("ws") ? {type: "ws"} : ws), "kw_on", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "column_name_array"], "postprocess":  d => {
            return{
                "type":"create index",
                "params":{
                    "table" : d[8],
                    "name": d[4],
                    "columns" : d[10]
                }
            }
        } },
    {"name": "where_statement", "symbols": ["kw_where", (lexer.has("ws") ? {type: "ws"} : ws), "comparison"], "postprocess":  d => {
            return [d[2]]
        } },
    {"name": "where_statement", "symbols": ["where_statement", (lexer.has("ws") ? {type: "ws"} : ws), "and", (lexer.has("ws") ? {type: "ws"} : ws), "comparison"], "postprocess": 
        d => {
            let arr = d[0]
        
            arr.push(d[4])
        
            return arr
        
        }   
        },
    {"name": "comparison", "symbols": ["word", (lexer.has("ws") ? {type: "ws"} : ws), "operator", (lexer.has("ws") ? {type: "ws"} : ws), "word"], "postprocess":  d => {
            return{
                "key": d[0],
                "value" :d[4],
                "operator": d[2]
            }
        } },
    {"name": "select_statement", "symbols": ["kw_select", (lexer.has("ws") ? {type: "ws"} : ws), "select_what", (lexer.has("ws") ? {type: "ws"} : ws), "kw_from", (lexer.has("ws") ? {type: "ws"} : ws), "table_name"], "postprocess":  d => {
            return{
                "type":"select",
                "params":{
                    "columns" : d[2],
                    "table": d[6]
                }        
            }
        } },
    {"name": "select_statement", "symbols": ["kw_select", (lexer.has("ws") ? {type: "ws"} : ws), "select_what", (lexer.has("ws") ? {type: "ws"} : ws), "kw_from", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "where_statement"], "postprocess":  d => {
            return{
                "type":"select",
                "params":{
                    "columns" : d[2],
                    "table": d[6],
                    "where":d[8]
                }
            }
        } },
    {"name": "select_what", "symbols": [(lexer.has("asterisk") ? {type: "asterisk"} : asterisk)], "postprocess": d => "asterisk"},
    {"name": "select_what", "symbols": ["column_name_array"], "postprocess": d => d[0]},
    {"name": "select_what", "symbols": ["column_name"], "postprocess": d => [d[0]]},
    {"name": "update_statement", "symbols": ["kw_update", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "set", (lexer.has("ws") ? {type: "ws"} : ws), "set_key_value_array", (lexer.has("ws") ? {type: "ws"} : ws), "where_statement"], "postprocess":  d => {
            return{
                "type":"update",
                "params":{
                    "where" : d[8],
                    "set": d[6],
                    "table": d[2]
                }        
            }
        } },
    {"name": "set_key_value_array", "symbols": ["set_key_value_array", (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("ws") ? {type: "ws"} : ws), "set_key_value"], "postprocess": 
        d => {
            let array = d[0];
        
            array = [...array, d[3]]
        
            return array;
        }
        },
    {"name": "set_key_value_array", "symbols": ["set_key_value"], "postprocess": d => [d[0]]},
    {"name": "set_key_value", "symbols": ["word", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("equal") ? {type: "equal"} : equal), (lexer.has("ws") ? {type: "ws"} : ws), "word"], "postprocess":  d => {
            return{
                "key": d[0],
                "value" :d[4],
            }
        } },
    {"name": "insert_statement", "symbols": ["kw_insert", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "insert_table_columns"], "postprocess":  d => {
            return{
                "type":"insert",
                "params":{
                    "document" : d[4],
                    "table": d[2]
                }
            }
        } },
    {"name": "batch_insert_statement", "symbols": ["kw_batch", (lexer.has("ws") ? {type: "ws"} : ws), "kw_insert", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "column_object_array"], "postprocess":  d => {
            return{
                "type":"batch insert",
                "params":{
                    "documents" : d[6],
                    "table": d[4]
                }
            }
        } },
    {"name": "insert_table_columns", "symbols": ["column_name_array"], "postprocess": d => d[0]},
    {"name": "insert_table_columns", "symbols": ["column_object"], "postprocess": d=> d[0]},
    {"name": "column_object_array", "symbols": [(lexer.has("lBracket") ? {type: "lBracket"} : lBracket), "column_object", (lexer.has("rBracket") ? {type: "rBracket"} : rBracket)], "postprocess": d => [d[1]]},
    {"name": "column_object_array", "symbols": ["column_object"], "postprocess": d => [d[0]]},
    {"name": "column_object_array", "symbols": [(lexer.has("lBracket") ? {type: "lBracket"} : lBracket), "column_object_array", (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("ws") ? {type: "ws"} : ws), "column_object", (lexer.has("rBracket") ? {type: "rBracket"} : rBracket)], "postprocess":  d => {
            let array = d[1]
        
            let newArray = [...array, d[4]]
        
            return newArray
        } },
    {"name": "column_object", "symbols": [(lexer.has("lcBracket") ? {type: "lcBracket"} : lcBracket), "property", (lexer.has("rcBracket") ? {type: "rcBracket"} : rcBracket)], "postprocess": d=> d[1]},
    {"name": "column_object", "symbols": [(lexer.has("lcBracket") ? {type: "lcBracket"} : lcBracket), "property_multi", (lexer.has("rcBracket") ? {type: "rcBracket"} : rcBracket)], "postprocess": d=> d[1]},
    {"name": "property_multi", "symbols": ["property_multi", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("ws") ? {type: "ws"} : ws), "property"], "postprocess": d=> { 
           let obj = d[0]
           
           obj[d[4][0]] = d[4][1]
        
           return obj
        } },
    {"name": "property_multi", "symbols": ["property_multi", (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("ws") ? {type: "ws"} : ws), "property"], "postprocess": d=> { 
           let obj = d[0]
           
           obj[d[3][0]] = d[3][1]
        
           return obj
        } },
    {"name": "property_multi", "symbols": ["property_multi", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("comma") ? {type: "comma"} : comma), "property"], "postprocess": d=> { 
           let obj = d[0]
           
           obj[d[3][0]] = d[3][1]
        
           return obj
        } },
    {"name": "property_multi", "symbols": ["property"], "postprocess": d=> { 
           let obj = {}
           
           obj[d[0][0]] = d[0][1]
        
           return obj
        } },
    {"name": "property", "symbols": ["key", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("ws") ? {type: "ws"} : ws), "value"], "postprocess": d => [d[0], d[4]]},
    {"name": "property", "symbols": ["key", (lexer.has("colon") ? {type: "colon"} : colon), "value"], "postprocess": d => [d[0], d[2]]},
    {"name": "property", "symbols": ["key", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("colon") ? {type: "colon"} : colon), "value"], "postprocess": d => [d[0], d[3]]},
    {"name": "property", "symbols": ["key", (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("ws") ? {type: "ws"} : ws), "value"], "postprocess": d => [d[0], d[3]]},
    {"name": "property", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "property", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": d => d[1]},
    {"name": "property", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "property"], "postprocess": d => d[1]},
    {"name": "property", "symbols": ["property", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": d => d[0]},
    {"name": "value", "symbols": ["word"], "postprocess": d => d[0]},
    {"name": "value", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => d[0]},
    {"name": "value", "symbols": ["column_object"], "postprocess": d => d[0]},
    {"name": "key", "symbols": ["word"], "postprocess": d => d[0]},
    {"name": "using_statement", "symbols": ["kw_using", (lexer.has("ws") ? {type: "ws"} : ws), "database_name"], "postprocess":  d => {
            return{
                "type":"using",
                "params": d[2]
            }
        } },
    {"name": "delete_statement", "symbols": ["kw_delete", (lexer.has("ws") ? {type: "ws"} : ws), "kw_from", (lexer.has("ws") ? {type: "ws"} : ws), "table_name", (lexer.has("ws") ? {type: "ws"} : ws), "where_statement"], "postprocess":  d => {
            return{
                "type":"delete",
                "params":{
                    "where" : d[6],
                    "table": d[4]
                }        
            }
        } },
    {"name": "drop_statement", "symbols": ["kw_drop", (lexer.has("ws") ? {type: "ws"} : ws), "database_name"], "postprocess":  d => {
            return{
                "type":"drop",
                "params": d[2]
            }
        } },
    {"name": "statement", "symbols": ["create_table_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["create_index_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["select_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["update_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["insert_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["batch_insert_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["using_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["delete_statement"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["drop_statement"], "postprocess": d => d[0]},
    {"name": "statement_array", "symbols": ["statement"], "postprocess": d => d[0]}
  ],
  ParserStart: "statement_array",
};

export default grammar;
