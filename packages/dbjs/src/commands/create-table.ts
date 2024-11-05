/*
 *  For Key-Value Database, Temporarily just use the JSON serialization to store. Maybe we should separate the db file for table.
 */


const execute = (params: {
  columns: string[];
  table: string;
}) => {
   
};

export default {
  type: 'CREATE TABLE',
  execute,
};