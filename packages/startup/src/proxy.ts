import path from 'node:path';
import proxy from 'http-proxy-middleware';

import log from './log';

import { Server } from 'connect';
import { ParsedArgs } from 'minimist';
import { WebpackConfiguration } from 'webpack-cli';

export default async (argv: ParsedArgs, app: Server) => {
  if (argv.proxy) {
    try {
      app.use(
        proxy.createProxyMiddleware({
          changeOrigin: true,
          target: new URL(argv.proxy),
        }),
      );
    } catch (error) {
      await loadConfig(argv, app);
    }
  }
};

type RemoveUndefined<T> = T extends undefined ? never : T;
type DevServerConfiguration = RemoveUndefined<WebpackConfiguration['devServer']>;
type ProxyConfigs = DevServerConfiguration['proxy'];

async function loadConfig(argv: ParsedArgs, app: Server) {
  let config = await import(path.resolve(argv.root, argv.proxy));

  try {
    config = config.devServer.proxy;
  } catch (error) {
    if (argv.log) log(error);
  }

  const ctxs = Object.values(config as RemoveUndefined<ProxyConfigs>);
  ctxs.forEach(ctx => {
    app.use(proxy.createProxyMiddleware(ctx as any));
  });
}
