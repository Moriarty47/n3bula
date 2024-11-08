import commandFactory from './command-factory';
import { Database } from '@/database';
import { tagify } from '@/utils';

export default commandFactory<{
  type: string;
  database: string;
}>('DROP', async (
  params,
  databases,
  _,
  askQuestion,
) => {
  const { database: databaseName } = params;

  let msg: string = 'Something went wrong. Please try again.';
  const database = databases.get(databaseName);
  if (database) {
    const answer = await (askQuestion(
      tagify(
        `Are you sure you want to drop the database "${databaseName}" [Y(es)/n(o)]? `,
        'red',
        'reset'
      )
    ).catch(err => err));
    if (answer.match(/^y(es)?$/i)) {
      await database.__deleteDatabase();
      databases.delete(databaseName);
      Database.currentDatabase = null;
      msg = 'Database deleted successfully.';
    } else {
      msg = 'Deletion aborted.';
    }
  } else {
    msg = `Database "${databaseName}" not found.`;
  }
  return { msg };
});