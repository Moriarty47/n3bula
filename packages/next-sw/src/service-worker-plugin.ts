import {
  basename,
  isAbsolute,
  normalize,
  relative,
  resolve,
} from 'node:path';
import { cwd } from 'node:process';

import { build } from './build';
import {
  access,
  clearErrorStackTrace,
  inject,
  NAME,
  noop,
  RELOAD,
  tapPromiseDelegate,
  WAIT,
} from './utils/helper';
import { listen } from './utils/live-reload';
import { logger } from './utils/logger';
import { patchResolve } from './utils/patch';
import { ensureWebpack } from './utils/webpack';

import type {
  NextConfigLoose,
  ServiceWorkerConfig,
  WebpackConfiguration,
  WebpackRecompilation,
} from './types';

export default function serviceWorkerPlugin(options: ServiceWorkerConfig = {}) {
  return <T>(userNextConfig: T): T => {
    const nextConfig = Object.assign({}, userNextConfig) as NextConfigLoose;

    const nextConfigWebpack = nextConfig.webpack || (config => config);

    const nextConfigPlugin: NextConfigLoose = {
      webpack(config, context) {
        const resolvedConfig: WebpackConfiguration = nextConfigWebpack(config, context);

        if (context.isServer) return resolvedConfig;

        options = Object.assign({}, options);

        if (typeof options.entry !== 'string') {
          logger.info('Skipping building service worker');
          return resolvedConfig;
        }

        const webpack = ensureWebpack(context.webpack);

        if (isAbsolute(options.entry)) {
          options.entry = resolve(cwd(), options.entry);
        } else {
          options.entry = normalize(options.entry);
        }

        if (access(options.entry) !== null) {
          logger.error(`./${relative(cwd(), options.entry)}`);
          console.error('ENOENT: No such file or directory');
          process.exit(2);
        }

        if (
          typeof options.port !== 'number' ||
          !Number.isInteger(options.port)
        ) {
          options.port = 3001;
        }

        let emit = noop;

        if (typeof options.livereload !== 'boolean') {
          if (context.dev) {
            logger.info('Live reloading feature is enabled by default during development');
          }

          options.livereload = context.dev;
        }

        if (options.livereload && context.dev) {
          // Start SSE server
          emit = listen(options.port, (address) => {
            logger.info(`Started live reloading server on ${address}`);
          });

          const client = resolve(__dirname, 'client.js');

          // Inject live reload client
          const resolvedEntry = resolvedConfig.entry as (() => Promise<Record<string, string[]>>);

          resolvedConfig.entry = () => resolvedEntry().then(entry => inject(client, entry));
        }

        // It is necessary to delegate state of own compilation
        const sync = tapPromiseDelegate();

        // Resolve public folder
        const dest = resolve(cwd(), 'public');

        // Resolve name
        if (typeof options.name === 'string' && options.name.length > 0) {
          // Fix extension
          options.name = `${basename(options.name, '.js')}.js`;
        } else {
          options.name = 'sw.js';
        }

        // Resolve scope
        const scope = nextConfig.basePath ? `${nextConfig.basePath}/` : `/`;

        const originalDefinePlugin = (resolvedConfig.plugins || []).find(p => p?.constructor.name === 'DefinePlugin');
        const originalDefineRaw = ((originalDefinePlugin || {}) as { definitions?: Record<string, string> }).definitions || {};
        const originalDefines = JSON.parse(JSON.stringify(originalDefineRaw));

        process.env.__NEXT_SW = `"${scope}${options.name}"`;
        process.env.__NEXT_SW_PORT = `"${options.port}"`;
        process.env.__NEXT_SW_SCOPE = `"${scope}"`;

        const pluginDefines = {
          'process.env.__NEXT_SW': `"${scope}${options.name}"`,
          'process.env.__NEXT_SW_PORT': `"${options.port}"`,
          'process.env.__NEXT_SW_SCOPE': `"${scope}"`,
        };

        const defines = Object.assign({}, originalDefines, pluginDefines);

        // Apply defines
        resolvedConfig.plugins!.push(new webpack.DefinePlugin(pluginDefines));

        // Use original resolve
        const _resolve = Object.assign({}, resolvedConfig.resolve);

        if (options.resolve) {
          patchResolve(_resolve, options.resolve === 'force');
        }

        const recompilation: WebpackRecompilation = {
          error: '',
          hash: null,
          status: false,
        };

        build(webpack, {
          define: new webpack.DefinePlugin(defines),
          defines,
          dest,
          dev: context.dev,
          entry: options.entry,
          name: options.name,
          resolve: _resolve,
          sideEffects: options.sideEffects ?? true,
        }, (stats) => {
          if (stats.hasErrors()) {
            const stat = stats.toJson({
              all: false,
              errors: true,
            });

            if (
              Array.isArray(stat.errors) &&
              stat.errors.length > 0
            ) {
              const error = clearErrorStackTrace(stat.errors[0].message);

              // Prevent spam with same error
              if (recompilation.error !== error) {
                recompilation.error = error;

                logger.error(stat.moduleName!);
                console.error(recompilation.error);

                if (context.dev) {
                  emit(WAIT, recompilation.hash);
                  return;
                }

                process.exit(1);
              }
            }
          }

          if (recompilation.hash !== stats.compilation.fullHash) {
            const time = (stats.compilation.endTime || 0) - (stats.compilation.startTime || 0);
            const formattedTime = time > 2000 ?
              `${Math.round(time / 100) / 10} s` :
              `${time} ms`;

            const formattedModules = `(${stats.compilation.modules.size} modules)`;

            logger[context.dev ? 'event' : 'info'](`Compiled service worker successfully in ${formattedTime} ${formattedModules}`);

            if (context.dev && recompilation.status) {
              logger.wait('Reloading...');
              emit(RELOAD, recompilation.hash);
            } else {
              sync.resolve();
            }

            recompilation.status = true;
            recompilation.hash = stats.compilation.fullHash;
          }
        });

        // Plugin to wait for compilation
        resolvedConfig.plugins!.push({
          apply(compiler) {
            compiler.hooks.done.tapPromise(NAME, () => sync.promise);
          },
          name: NAME,
        });

        return resolvedConfig;
      },
    };

    return Object.assign({}, nextConfig, nextConfigPlugin) as T;
  };
}
