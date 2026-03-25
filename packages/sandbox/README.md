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
import net from 'net';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createSandbox } from '@n3bula/sandbox';
const PORT = 4000;
const server = net.createServer();
server.listen(PORT, () => console.log(`TCP server listening on ${PORT}`));
server.on('error', err => console.error('server error', err));
const destroy = () => {
  server.close();
  process.exit();
};
process.on('SIGINT', destroy);
process.on('SIGTERM', destroy);

createSandbox('sandbox', resolve(fileURLToPath(dirname(import.meta.url)), './client.ts'), { server });
```

```ts
// client.ts
console.log(1); // change to console.log(server);
// will print current server instance without restart server
```

## Author

- [Moriarty47](https://github.com/Moriarty47)

## License

[The MIT License(MIT)](https://github.com/Moriarty47/n3bula/blob/main/LICENSE)
