/* eslint-disable sort-keys */
import { resolve } from 'node:path';

import ServiceWorkerMinify from './utils/minify';

import type {
  ServiceWorkerBuildCallback,
  ServiceWorkerBuildConfig,
  Webpack,
} from './types';

const loader = resolve(__dirname, 'loader.js');

export function build(webpack: Webpack, config: ServiceWorkerBuildConfig, callback: ServiceWorkerBuildCallback) {
  let rules;
  let treeShaking = !config.dev;

  const options = {
    defines: config.defines,
    minify: config.dev,
  };

  if (typeof config.sideEffects === 'boolean') {
    rules = [{
      loader,
      options,
      sideEffects: config.sideEffects,
    }];

    treeShaking = !config.sideEffects;
  } else {
    rules = [{
      exclude: config.sideEffects,
      loader,
      options,
      sideEffects: false,
    }, {
      loader,
      options,
      sideEffects: false,
    }];
  }

  return webpack({
    mode: config.dev ? 'development' : 'production',
    watch: config.dev,
    watchOptions: {
      aggregateTimeout: 5,
      ignored: ['**/public/**'],
    },
    cache: {
      cacheUnaffected: true,
      type: 'memory',
    },
    devtool: 'cheap-module-source-map',
    performance: false,
    target: 'webworker',
    entry: config.entry,
    resolve: config.resolve,
    externalsType: 'self',
    output: {
      asyncChunks: false,
      chunkLoading: false,
      chunkFormat: false,
      globalObject: 'self',
      iife: false,
      path: config.dest,
      filename: config.name,
    },
    optimization: {
      splitChunks: false,
      runtimeChunk: false,
      concatenateModules: true,
      mergeDuplicateChunks: true,
      innerGraph: treeShaking,
      providedExports: treeShaking,
      usedExports: treeShaking,
      minimize: !config.dev,
      minimizer: [ServiceWorkerMinify],
    },
    module: {
      strictExportPresence: false,
      rules: [{
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: { fullySpecified: false },
      }, {
        test: /\.(js|mjs|ts)$/,
        oneOf: rules,
      }],
    },
    plugins: [config.define],
  }, (err: any, stats: any) => {
    if (err) throw err;

    if (!stats) return;

    return callback(stats);
  });
}
