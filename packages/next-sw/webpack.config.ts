import { resolve } from 'node:path';

import Dts from './webpack.dts';
import Tsc from './webpack.tsc';

import type { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  target: 'node',
  devtool: false,
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  entry: {
    index: resolve(__dirname, './src/index.ts'),
    client: resolve(__dirname, './src/client.ts'),
    loader: resolve(__dirname, './src/loader.ts'),
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: resolve(__dirname, './dist'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    './dynamic': './dynamic',
    '../dynamic': './dynamic',
  },
  plugins: [
    new Tsc({
      entry: resolve(__dirname, './src/dynamic.ts'),
      tsConfig: {
        compilerOptions: {
          noCheck: true,
          outDir: 'dist',
        },
      },
    }),
    new Dts({
      entry: {
        index: resolve(__dirname, './dist/index.d.ts'),
        client: resolve(__dirname, './dist/client.d.ts'),
        loader: resolve(__dirname, './dist/loader.d.ts'),
      },
      ignores: [
        resolve(__dirname, './dist/dynamic.js'),
        resolve(__dirname, './dist/dynamic.d.ts'),
      ],
    }),
  ],
};

export default config;
