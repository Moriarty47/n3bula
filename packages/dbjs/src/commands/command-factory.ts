import type { Emitter } from '@/emitter';
import type { AskQuestion } from '@/ask';
import type { Database } from '@/database';

export type CommandType =
  | 'USE'
  | 'DROP'
  | 'CREATE DATABASE'
  | 'CREATE TABLE'
  | 'CREATE INDEX'
  | 'INSERT'
  | 'BATCH INSERT'
  | 'DELETE'
  | 'UPDATE'
  | 'SELECT';

export type ExecuteFunc<T, R> = (
  params: T,
  databases: Map<string, Database>,
  emitter: Emitter,
  askQuestion: AskQuestion,
) => Promise<R>;

type CommandFactory = <T, R = any>(
  type: CommandType,
  execute: ExecuteFunc<T, R>,
) =>
  ({
    type: CommandType;
    execute: ExecuteFunc<T, R>;
  });


const commandFactory: CommandFactory = (type, execute) => {
  return {
    type,
    execute,
  };
};

export default commandFactory;