import os from 'node:os';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

import connect from 'connect';
import serveStatic from 'serve-static';
import serveIndex from 'serve-index';
import fallback from 'connect-history-api-fallback';
import open from 'open';

import log from './log';
import argv from './argv';
import proxy from './proxy';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openUrl = (url: string) => open(url, argv.open ? { app: { name: argv.open } } : undefined);

const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  const ipList: string[] = [];

  Object.values(interfaces).forEach(details => {
    if (!details) return;
    details.forEach(detail => {
      if (detail.internal || detail.family !== 'IPv4') return;

      ipList.push(detail.address);
    });
  });

  ipList.sort(ip1 => (ip1.indexOf('192') >= 0 ? -1 : 1));

  return ipList[0] || '127.0.0.1';
};

const app = connect();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (argv.log) log(`${req.method} ${req.url}`);
  next();
});

if (argv.fallback !== undefined) {
  console.log('Enable html5 history mode.');
  app.use(
    fallback({
      index: argv.fallback || './index.html',
    }) as any,
  );
}

await proxy(argv, app);

app.use(serveStatic(argv.root, { index: ['index.html'] }));
app.use(serveIndex(argv.root, { icons: true }) as any);

const port = parseInt(argv._[0] || argv.port, 10);
const securePort = port + 1;
const hostname = argv.name || getIPAddress();
http.createServer(app).listen(port, () => {
  const url = `http://${hostname}${port !== 80 ? `:${port}` : ''}/`;
  console.log(`Running at ${url}`);
  if (argv.o === undefined) return;
  openUrl(url);
});

const certOptions = {
  key: readFileSync(path.join(__dirname, '../certs', 'key.pem')),
  cert: readFileSync(path.join(__dirname, '../certs', 'cert.pem')),
};
https.createServer(certOptions, app).listen(securePort, () => {
  const url = `https://${hostname}${securePort !== 80 ? `:${securePort}` : ''}/`;
  console.log(`Also running at ${url}`);
});
