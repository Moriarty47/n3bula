import CREATE_TABLE from './create-table';

export enum COMMANDS {
  CREATE_TABLE = 'CREATE TABLE',
  CREATE_INDEX = 'CREATE INDEX',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INSERT = 'INSERT',
  BATCH_INSERT = 'BATCH INSERT',
  USING = 'USING',
  DROP = 'DROP',
  EXIT = 'EXIT',
}

export const commands = [
  CREATE_TABLE,
];