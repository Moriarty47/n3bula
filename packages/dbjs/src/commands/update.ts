import commandFactory from './command-factory';

export default commandFactory<{
  columns: string[];
  table: string;
}>('UPDATE', (params) => {

  return {};
});