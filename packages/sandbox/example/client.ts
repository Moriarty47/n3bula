// import type { Server } from './server';

// declare const server: Server;
// console.log(typeof server);

// const fs = _require(
//   'node:fs/promises',
// ) as typeof import('node:fs/promises');

// const file = await fs.readFile('./example/client.ts', 'utf8');
// console.log('file :>>', file);

const { echo } = _require('@n3bula/echo') as typeof import('@n3bula/echo');

echo(globalThis);
