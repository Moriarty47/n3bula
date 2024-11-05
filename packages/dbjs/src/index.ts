import { Database } from './database';
import { createInt32Buffer, logger } from './utils';

const db = new Database('data');
db.open();

logger(db.get('test'));
logger(db.get('emoji'));

db.close();

// if (process.argv[2] === 'repl') {
//   import('./repl').then(m => m.startREPL());
// }
