const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');
const DtsBundleWebpackPlugin =
  require('bundle-declarations-webpack-plugin').default;

/** @type {import('webpack').Configuration} */
const config = {
  entry: {
    bundle: './src/index.ts',
    'bundle.min': './src/index.ts',
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(t|j)s$/,
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
        extractComments: false,
        include: /\.min\.js/,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        test: /\.js/,
      }),
    ],
  },
  output: {
    clean: true,
    environment: {
      arrowFunction: false,
    },
    filename: '[name].js',
    globalObject: 'this',
    library: {
      export: 'default',
      name: '{{libraryName}}',
      type: 'umd',
    },
    path: path.resolve(__dirname, 'lib'),
  },
  plugins: [],
  resolve: {
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
    extensions: ['.ts', '.js'],
  },
};

module.exports = env => {
  if (!env.WEBPACK_WATCH) {
    config.plugins.push(
      new DtsBundleWebpackPlugin({
        compilationOptions: {
          preferredConfigPath: path.resolve(__dirname, 'tsconfig.json'),
        },
        entry: path.resolve(__dirname, 'src/index.ts'),
        outFile: 'bundle.d.ts',
        removeEmptyExports: true,
        removeEmptyLines: true,
      }),
    );
  }

  return config;
};
