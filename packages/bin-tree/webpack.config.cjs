const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const getEnclose = (ids) => {
  let a = ids.join(',');
  return a + ':' + a;
};
const enclose = getEnclose(['Object', 'Symbol']);
/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: {
    'index': './src/index.ts',
    'index.min': './src/index.ts',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: {
      name: 'BinTree',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    environment: {
      arrowFunction: false,
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
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
                [
                  '@babel/preset-env',
                  {
                    targets: 'last 2 versions',
                  },
                ],
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js/,
        terserOptions: {
          enclose,
          mangle: true,
          compress: true,
        },
      }),
    ],
  },
  plugins: [],
};
