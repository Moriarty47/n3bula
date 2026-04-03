import path from 'node:path';

import TerserPlugin from 'terser-webpack-plugin';

import type { Configuration } from 'webpack';

const config: Configuration = {
  devtool: 'source-map',
  entry: {
    index: './src/index.ts',
    'index.min': './src/index.ts',
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.[tj]s$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              experimentalWatchApi: false,
              onlyCompileBundledFiles: true,
              transpileOnly: false,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ test: /\.min\.js$/ })],
    sideEffects: false,
  },
  output: {
    clean: true,
    globalObject: 'this',
    library: {
      name: {
        amd: '{{libraryName}}',
        commonjs: '{{libraryName}}',
        root: '{{libraryName}}',
      },
      type: 'umd',
    },
    path: path.resolve(__dirname, 'lib/umd'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  target: 'node',
};

export default config;
