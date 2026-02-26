import os from 'node:os';
import http from 'node:http';
import https from 'node:https';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import open from 'open';
import connect from 'connect';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import fallback from 'connect-history-api-fallback';

import log from './log';
import argv from './argv';
import proxy from './proxy';
import { isFilenameOnly, toAbsolutePath } from './util';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const { key, cert } = argv;
let keyName = 'key.pem';
let certName = 'cert.pem';
let usePath = false;
if (key && cert) {
  if (isFilenameOnly(key) && isFilenameOnly(cert)) {
    keyName = key;
    certName = cert;
  } else {
    usePath = true;
  }
}

const certOptions = usePath
  ? {
      key: readFileSync(toAbsolutePath(argv.key, __dirname)),
      cert: readFileSync(toAbsolutePath(argv.cert, __dirname)),
    }
  : {
      key: readFileSync(join(__dirname, '../certs', keyName)),
      cert: readFileSync(join(__dirname, '../certs', certName)),
    };
https.createServer(certOptions, app).listen(securePort, () => {
  const url = `https://${hostname}${securePort !== 80 ? `:${securePort}` : ''}/`;
  console.log(`Also running at ${url}`);
});
