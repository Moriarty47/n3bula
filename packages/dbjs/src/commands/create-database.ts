import commandFactory from './command-factory';
import { Database } from '@/database';
import { DBError } from '@/utils';

export default commandFactory<{
  type: string;
  database: string;
}>('CREATE DATABASE', async (
  params,
  databases,
) => {
  const { database: databaseName } = params;
  if (databases.get(databaseName)) {
    throw new DBError(`Database "${databaseName}" already exists.`);
  }
  const database = new Database(databaseName);
  Database.currentDatabase = databaseName;
  databases.set(databaseName, database);
  const msg = await database.open();
  return { msg };
});