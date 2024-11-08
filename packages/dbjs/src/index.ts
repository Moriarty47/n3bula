export { Database } from '@/database';

if (process.argv[2] === 'repl') {
  import('./repl').then(m => m.startREPL());
}
