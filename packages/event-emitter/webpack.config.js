const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const entry = path.resolve(__dirname, './index.ts');
/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: {
    index: entry,
    'index.min': entry,
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    clean: true,
    library: {
      type: 'commonjs-static',
    }
  },
  stats: 'errors-warnings',
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.min\.js$/,
      terserOptions: {
        enclose: (() => {
          let a = ['Object', 'Symbol'].join(',');
          return a + ':' + a;
        })(),
        mangle: true,
        compress: true,
      }
    })]
  }
};