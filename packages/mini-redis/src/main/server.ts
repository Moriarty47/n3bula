import { createServer } from 'node:net';

import { MiniRedis } from './mini-redis';
import { LF, PORT } from '$const';

import type { Command } from './mini-redis';
import { NOOP, toInt } from '$util/index';
import { logger } from '$util/logger';

const redis = new MiniRedis({ maxFileSize: 5 * 1024 * 1024 });

const server = createServer(socket => {
  socket.setEncoding('utf8');
  socket.write(`+OK MiniRedis${LF}`);

  let buf = '';
  socket.on('error', NOOP);
  socket.on('data', async chunk => {
    buf += chunk;
    let idx;

    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      const parts = line.split(' ');
      let [cmd, key, ...value] = parts;
      cmd = cmd.toUpperCase() as Command;

      try {
        switch (cmd) {
          case 'SET': {
            await redis.set(key, value.join(' '));
            socket.write(`+OK${LF}`);
            break;
          }
          case 'GET': {
            const v = await redis.get(key);
            socket.write(`${v === null ? '%-1' : `+${v}`}${LF}`);
            break;
          }
          case 'DEL': {
            const n = await redis.del(key);
            socket.write(`:${n}${LF}`);
            break;
          }
          case 'EXPIRE': {
            const ms = toInt(value[0] || '0');
            const r = await redis.expire(key, ms);
            socket.write(`:${r}${LF}`);
            break;
          }
          case 'KEYS': {
            const pattern = key || '*';
            const ks = await redis.keys(pattern);
            socket.write(`+${JSON.stringify(ks)}${LF}`);
            break;
          }
          case 'QUIT': {
            socket.write(`+BYE${LF}`);
            socket.end();
            break;
          }
          default:
            socket.write(`-ERR unknown command${LF}`);
            break;
        }
      } catch (err: any) {
        socket.write(`-ERR ${err.message}${LF}`);
      }
    }
  });
});

server.listen(PORT, () => {
  logger.info('MiniRedis server listening on', PORT);
});

process.on('SIGINT', async () => {
  logger('Shutting down...');
  server.close();
  await redis.close();
  process.exit(0);
});
