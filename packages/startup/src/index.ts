import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';

import connect from 'connect';
import fallback from 'connect-history-api-fallback';
import open from 'open';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';

import argv from './argv';
import log from './log';
import proxy from './proxy';
import { isFilenameOnly, toAbsolutePath } from './util';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const openUrl = (url: string) =>
  open(url, argv.open ? { app: { name: argv.open } } : undefined);

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

app.use(async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (argv.log) {
    if (req.url) {
      const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
      const physical = path.join(argv.root, decodeURIComponent(urlPath));
      log('REQ', req.method, req.url, '->', physical);
    }
    log(`${req.method} ${req.url}`);
  }
  next();
});

app.use(async (req, res, next) => {
  if (!req.url) return next();
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const ext = path.extname(url.pathname).toLowerCase();

    // 根据需要匹配你的视频/音频路径，例如 /media/*.mp4
    const isMedia =
      ['.mp4', '.webm', '.mp3', '.m4a', '.ogg'].includes(ext)
      && url.pathname.startsWith('/media/');
    if (!isMedia) return next();

    const filePath = path.join(argv.root, decodeURIComponent(url.pathname));
    // 检查文件是否存在
    await fsp.access(filePath, fs.constants.R_OK);

    const stat = await fsp.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const contentType =
      {
        '.m4a': 'audio/mp4',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.ogg': 'audio/ogg',
        '.webm': 'video/webm',
        '.wmv': 'video/x-ms-asf',
      }[ext] || 'application/octet-stream';

    res.setHeader('Accept-Ranges', 'bytes');

    if (range) {
      // 处理 Range 请求
      const matches = range.match(/bytes=(\d*)-(\d*)/);
      if (!matches) {
        res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
        return res.end();
      }
      const start = matches[1] === '' ? 0 : parseInt(matches[1], 10);
      const end =
        matches[2] === ''
          ? fileSize - 1
          : Math.min(parseInt(matches[2], 10), fileSize - 1);
      if (start > end || start >= fileSize) {
        res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
        return res.end();
      }
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Length': String(chunkSize),
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Type': contentType,
      });
      const stream = fs.createReadStream(filePath, { end, start });
      stream.pipe(res);
      stream.on('error', () => {
        res.destroy();
      });
    } else {
      // 没有 Range，返回整个文件（可用于小文件或兼容客户端）
      res.writeHead(200, {
        'Content-Length': String(fileSize),
        'Content-Type': contentType,
      });
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', () => {
        res.destroy();
      });
    }
  } catch (err) {
    // 文件不存在或其他错误，传递给下一个中间件（serve-static 或 finalhandler 会处理 404）
    return next();
  }
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

app.use(
  serveStatic(argv.root, {
    extensions: ['html', 'htm'],
    index: ['index.html'],
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.html' || ext === '.htm') {
        // HTML 不缓存（每次都请求或按协商缓存处理）
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (['.js', '.css'].includes(ext)) {
        // 静态资源（带指纹时可长期缓存）
        // 如果你使用内容哈希文件名（app.abc123.js），可以缓存很久并使用 immutable
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (
        ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)
      ) {
        // 图片：长期缓存（如果文件名不变则安全）
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // 其它资源的默认策略（短缓存，可由后端按需调整）
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  }),
);
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
      cert: fs.readFileSync(toAbsolutePath(argv.cert, __dirname)),
      key: fs.readFileSync(toAbsolutePath(argv.key, __dirname)),
    }
  : {
      cert: fs.readFileSync(path.join(__dirname, '../certs', certName)),
      key: fs.readFileSync(path.join(__dirname, '../certs', keyName)),
    };
https.createServer(certOptions, app).listen(securePort, () => {
  const url = `https://${hostname}${securePort !== 80 ? `:${securePort}` : ''}/`;
  console.log(`Also running at ${url}`);
});
