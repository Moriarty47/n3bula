import commandFactory from './command-factory';
import { assertIsDefined } from '@/utils';
import { Database } from '@/database';

export default commandFactory<{
  type: string;
  table: string;
  columns: string[];
}>('CREATE TABLE', async (
  params,
  databases,
) => {
  assertIsDefined(Database.currentDatabase, 'No current database');

  const database = databases.get(Database.currentDatabase);

  if (!database) {
    throw new Error(`Database "${Database.currentDatabase}" does not exist.`);
  }

  const { table, columns } = params;
  database.createTable(table, columns);

  return {};
});
