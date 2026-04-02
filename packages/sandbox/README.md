# `@n3bula/sandbox`

### Simple Sandbox for Node.js module quick test

Just use for debug
Debug the current process without restart process

## Install

```sh
npm install @n3bula/sandbox
# or
yarn add @n3bula/sandbox
# or
pnpm add @n3bula/sandbox
```

## Example

```ts
// server.ts
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
```

```ts
// client.ts
import type { Server } from './server';

declare const server: Server;
console.log(server, typeof server);
// will print current server instance without restart server

const fs = _require(
  'node:fs/promises',
) as typeof import('node:fs/promises');

const file = await fs.readFile('./example/client.ts', 'utf8');
console.log('file :>>', file);

const { echo } = _require('@n3bula/echo') as typeof import('@n3bula/echo');

echo(globalThis);
```

## Author

- [Moriarty47](https://github.com/Moriarty47)

## License

[The MIT License(MIT)](https://github.com/Moriarty47/n3bula/blob/main/LICENSE)
