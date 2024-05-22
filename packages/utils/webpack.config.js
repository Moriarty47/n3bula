const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const getEnclose = (ids) => {
  let a = ids.join(',');
  return a + ':' + a;
};

const isFile = (path) => {
  try {
    const stat = fs.statSync(path);
    return stat.isFile();
  } catch (error) {
    return false;
  }
};

const enclose = getEnclose(['window', 'Object', 'Symbol', 'String', 'console']);

const mode = process.env.NODE_ENV || 'development';

function getEntry(key, name) {
  let entry = path.resolve(__dirname, './src', `${key}.ts`);

  if (!isFile(entry)) {
    entry = path.resolve(__dirname, './src', `${key}/index.ts`);
  }

  return {
    // [key]: { import: entry, library: { type: 'umd', name } },
    [`${key}.min`]: { import: entry, library: { type: 'umd', name } }
  };
}

/** @type {import('webpack').Configuration} */
module.exports = {
  mode,
  entry: {
    ...getEntry('index', 'N3bulaUtils'),
    ...getEntry('crypto', 'N3bulaCrypto'),
    ...getEntry('rsa', 'N3bulaRsa'),
  },
  target: 'node',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'lib/umd'),
    globalObject: 'this',
  },
  devtool: false,
  stats: 'errors-warnings',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.min\.js$/i,
      extractComments: false,
      terserOptions: {
        enclose,
        mangle: true,
        compress: true,
      }
    })]
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
};