import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';


const config: Configuration = {
  target: "node",
  mode: 'production',
  entry: {
    index: './src/index.ts',
    'index.min': './src/index.ts',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'lib/umd'),
    library: {
      type: 'umd',
      name: {
        amd: 'prettyJson',
        commonjs: 'prettyJson',
        root: 'prettyJson',
      },
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
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/json.css'), to: path.resolve(__dirname, 'lib/esm') }
      ]
    })
  ],
  optimization: {
    sideEffects: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({ test: /\.min\.js$/ })
    ],
  },
};

export default config;