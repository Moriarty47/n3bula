@include "base.ne"

@lexer lexer

create_statement -> create_seq

create_seq -> create _ database _ identifier {% (d) => ({
  type: "CREATE DATABASE",
  database: d[4][0].value,
}) %}

create_seq -> create _ table _ identifier _ lparen _ column_list _ rparen {% (d) => ({
  type: "CREATE TABLE",
  table: d[4][0].value,
  columns: d[8],
}) %}

column_list -> column {% (d) => [d[0]] %}

column_list -> column_list _ comma _ column {% (d) => d[0].concat([d[4]]) %}

column -> identifier _ data_type {% (d) => ({
  column: d[0][0].value,
  ...d[2],
}) %}

data_type -> 
    "BOOLEAN"    {% (d) => ({ data_type: d[0].value }) %}
  | "TINYINT" {% (d) => ({ data_type: d[0].value, data_bytes: 1 }) %} 
  | "SMALLINT" {% (d) => ({ data_type: d[0].value, data_bytes: 2 }) %} 
  | "MEDIUMINT" {% (d) => ({ data_type: d[0].value, data_bytes: 3 }) %} 
  | "INT"    {% (d) => ({ data_type: d[0].value, data_bytes: 4 }) %}
  | "BIGINT" {% (d) => ({ data_type: d[0].value, data_bytes: 8 }) %} 
  | "DOUBLE" {% (d) => ({ data_type: d[0].value, data_bytes: 8 }) %} 

date_type ->
    "YEAR" {% (d) => ({ data_type: d[0].value, data_bytes: 1 }) %}
  | "DATE" {% (d) => ({ data_type: d[0].value, data_bytes: 4 }) %}
  | "TIME" {% (d) => ({ data_type: d[0].value, data_bytes: 4 }) %}
  | "TIMESTAMP" {% (d) => ({ data_type: d[0].value, data_bytes: 4 }) %}
  | "DATETIME" {% (d) => ({ data_type: d[0].value, data_bytes: 8 }) %}

data_type -> 
    "CHAR" lparen number rparen {% (d) => ({ data_type: d[0].value, data_bytes: d[2][0].value, max_bytes: 0xff }) %}
  | "VARCHAR" lparen number rparen {% (d) => ({ data_type: d[0].value, data_bytes: d[2][0].value, max_bytes: 0xffff }) %}
  | "TINYBLOB" {% (d) => ({ data_type: d[0].value, max_bytes: 0xff }) %}
  | "TINYTEXT" {% (d) => ({ data_type: d[0].value, max_bytes: 0xff }) %}
  | "BLOB" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffff }) %}
  | "TEXT" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffff }) %}
  | "MEDIUMBLOB" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffffff }) %}
  | "MEDIUMTEXT" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffffff }) %}
  | "MEDIUMTEXT" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffffff }) %}
  | "LONGBLOB" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffffffff }) %}
  | "LONGTEXT" {% (d) => ({ data_type: d[0].value, max_bytes: 0xffffffff }) %}

create_statement -> create_index

create_index -> create _ index _ identifier _ on _ identifier _ lparen identifier rparen {% (d) => ({
  type: "CREATE INDEX",
  index_name: d[4][0].value,
  table_name: d[8][0].value,
  column: d[11][0].value,
}) %}