import net from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createSandbox } from '@n3bula/sandbox';

const PORT = 4000;
const server = net.createServer();

export type Server = typeof server;

server.listen(PORT, () => console.log(`TCP server listening on ${PORT}`));
const destroy = () => {
  server.close();
  process.exit();
};
process.on('SIGINT', destroy);
process.on('SIGTERM', destroy);

const file = resolve(fileURLToPath(dirname(import.meta.url)), './client.ts');
createSandbox(
  file,
  {
    server,
  },
  {
    // name: 'sandbox',
  },
);
