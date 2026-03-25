import net from 'net';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { createSandbox } from '../src';

const PORT = 4000;
const server = net.createServer();
server.listen(PORT, () => console.log(`TCP server listening on ${PORT}`));
const destroy = () => {
  server.close();
  process.exit();
};
process.on('SIGINT', destroy);
process.on('SIGTERM', destroy);

const file = resolve(fileURLToPath(dirname(import.meta.url)), './client.ts');
createSandbox('sandbox', file, {
  server,
});
