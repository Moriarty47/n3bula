# `@n3bula/express`

### A Node.js server based on Express.js

## Install

```sh
npm install @n3bula/express
# or
yarn add @n3bula/express
# or
pnpm add @n3bula/express
```

## Example

### 1. Conventional routes

```ts
// nova.config.ts
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { virtualApiResolver } from '@n3bula/express';

import type { NovaOptions } from '@n3bula/nova';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config: NovaOptions = {
  nova: { input: resolve(__dirname, 'src/index.ts') },
  output: { dir: 'dist' },
  plugins: [
    virtualApiResolver({
      dir: 'src/apis',
    }),
  ],
};

export default config;
```

```json
// package.json
{
  ...
  "scripts": {
    "dev": "node --import @n3bula/express/loader",
  }
  ...
}
```

```ts
import { createApp } from '@n3bula/express';
import { logger } from '$util/log';

// use bundler to handle the virtual module
import { apis } from 'virtual:api-resolver';

const PORT = 3000;
async function startServer() {
  const app = await createApp({ apiDir: apis });
  const server = await app.listen(PORT);
  logger(`Server is running on http://localhost:${PORT}`);
  return server;
}

startServer();
```

### 2. Manual import routes

```ts
import { createApp } from '@n3bula/express';
import { logger } from '$util/log';

const PORT = 3000;
async function startServer() {
  const app = await createApp({
    apis: {
      test: () => import('./apis/test'),
      test2: () => import('./apis/test2'),
    },
  });
  const server = await app.listen(PORT);
  logger(`Server is running on http://localhost:${PORT}`);
  return server;
}

startServer();
```

## Author

- [Moriarty47](https://github.com/Moriarty47)

## License

[The MIT License(MIT)](https://github.com/Moriarty47/n3bula/blob/main/LICENSE)
