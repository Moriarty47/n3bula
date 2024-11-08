import { Database } from '@/database';
import commandFactory from './command-factory';
import { DBError } from '@/utils';

export default commandFactory<{
  type: string;
  database: string;
}>('USE', async (
  params,
  databases,
) => {
  const { database: databaseName } = params;

  if (Database.currentDatabase) {
    if (Database.currentDatabase === databaseName) {
      return { msg: 'Already using the specified database.' };
    }
  }
  
  const database = databases.get(databaseName);
  if (!database) {
    throw new DBError(`Database "${databaseName}" does not exist.`);
  }

  Database.currentDatabase && await databases.get(Database.currentDatabase)?.close();
  
  Database.currentDatabase = databaseName;
  const msg = await database.open();
  return { msg };
});