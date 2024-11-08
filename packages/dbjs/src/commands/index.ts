// import CREATE_TABLE from './create-table';
// import CREATE_INDEX from './create-index';
import USE from './use';
import DROP from './drop';
import DELETE from './delete';
import UPDATE from './update';
import SELECT from './select';
import INSERT from './insert';
import CREATE_DATABASE from './create-database';
import CREATE_TABLE from './create-table';
import CREATE_INDEX from './create-index';
import BATCH_INSERT from './batch-insert';

export enum COMMANDS {
  USE = 'USE',
  DROP = 'DROP',
  CREATE_DATABASE = 'CREATE DATABASE',
  CREATE_TABLE = 'CREATE TABLE',
  CREATE_INDEX = 'CREATE INDEX',
  INSERT = 'INSERT',
  BATCH_INSERT = 'BATCH INSERT',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  SELECT = 'SELECT',
  EXIT = 'EXIT',
}

export const commands = [
  USE,
  DROP,
  CREATE_DATABASE,
  CREATE_TABLE,
  CREATE_INDEX,
  INSERT,
  BATCH_INSERT,
  DELETE,
  UPDATE,
  SELECT,
];