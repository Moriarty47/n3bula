const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const getEnclose = (ids) => {
  let a = ids.join(',');
  return a + ':' + a;
};
const enclose = getEnclose(['Object', 'Symbol']);
const entry = path.resolve(__dirname, './src/index.ts');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: {
    index: entry,
    'index.min': entry
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'lib'),
    library: {
      type: 'umd',
      name: 'PrettyJson',
    },
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
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
      {
        test: /\.css$/,
        type: 'asset/source'
      }
    ],
  },
  devtool: false,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/i,
        terserOptions: {
          enclose,
          mangle: true,
          compress: true,
        }
      })
    ],
  },
};