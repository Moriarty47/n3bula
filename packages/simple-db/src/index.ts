import repl, { REPLServer } from 'node:repl';
import { Database } from './database';

export default function SimpleDB(): REPLServer {
  let db: Database;

  const replServer = repl.start({
    prompt: 'db > ',
    completer: (line: string) => {
      const completions = ['open', 'exit', 'set', 'get', 'update'];
      const hits = completions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : completions, line];
    },
    eval: async (evalCmd, _, __, callback) => {
      const [cmd, key, value] = evalCmd.trim().split(' ');

      switch (cmd) {
        case 'open': {
          const name = key || 'data';
          db = new Database({ name }).open();
          return callback(null, `Database ${db.name} opened`);
        }
        case 'close': {
          if (!db) return callback(null, `Open database first`);
          db.close();
          return callback(null, `Database ${db.name} closed`);
        }
        case 'get': {
          if (!db) return callback(null, `Open database first`);
          const res = db.get(key);
          return callback(null, `Database ${db.name} get [${key}] value: ${res}`);
        }
        case 'set': {
          if (!db) return callback(null, `Open database first`);
          const res = db.set(key, value);
          return callback(null, `Database ${db.name} set [${key}] value: ${res}`);
        }
        case 'update': {
          if (!db) return callback(null, `Open database first`);
          const res = db.update(key, value);
          return callback(null, `Database ${db.name} update [${key}] value: ${res}`);
        }
        case 'exit': {
          db?.close();
          process.exit(0);
        }
        default:
          return callback(null, 'Unknown command');
      }
    },
    writer: (output) => {
      switch (typeof output) {
        case 'object': {
          if (output.error) return output.error.message;
          if (output.message) return output.message;
          return JSON.stringify(output, null, 2);
        }
        default:
          return output;
      }
    }
  });

  replServer.on('exit', () => {
    db?.close();
    process.exit(0);
  });

  return replServer;
}
