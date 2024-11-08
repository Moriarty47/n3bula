import commandFactory from './command-factory';
import { assertIsDefined } from '@/utils';
import { Database } from '@/database';

export default commandFactory<{
  type: string;
  table: string;
  columns: string[];
  values: any[];
}>('INSERT', async (
  params,
  databases,  
) => {
  assertIsDefined(Database.currentDatabase, 'No current database');

  const { table, columns, values } = params;
  console.log('table, columns, values :>>', table, columns, values);
  return {};
});