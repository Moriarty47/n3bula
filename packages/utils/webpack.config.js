const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const getEnclose = (ids) => {
  let a = ids.join(',');
  return a + ':' + a;
};

const entry = path.resolve(__dirname, './src/index.ts');
const enclose = getEnclose(['Object', 'Symbol']);

/** @type {import('webpack').Configuration[]} */
module.exports = {
  entry: {
    index: entry,
    'index.min': entry
  },
  mode: 'production',
  target: 'node',
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.[tj]/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,
              onlyCompileBundledFiles: true,
              experimentalWatchApi: false,
            },
          },
        ],
      },
    ],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'lib/umd'),
    library: {
      type: 'umd',
      name: {
        amd: 'N3bulaUtils',
        commonjs: 'N3bulaUtils',
        root: 'N3bulaUtils',
      },
    },
    globalObject: 'this',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.min\.js$/i,
      terserOptions: {
        enclose,
        mangle: true,
        compress: true,
      }
    })]
  },
};