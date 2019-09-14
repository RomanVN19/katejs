const nodeExternals = require('webpack-node-externals');
const path = require('path');
const ROOT = path.resolve(__dirname);
const root = path.join.bind(path, ROOT);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (env) {
  return {
    mode: 'production',
    target: 'web',
    entry: {
      client: './src/client.js',
      translations: './src/translations.js',
    },
    output: {
      /**
       * The output directory as absolute path (required).
       *
       * See: https://webpack.js.org/configuration/output/#output-path
       */
      path: root('lib'),
      filename: '[name].js',
      /**
       * https://webpack.js.org/guides/author-libraries/
       */
      libraryTarget: 'umd',
    },
    externals: [
      nodeExternals(),
      './fields',
    ],
    resolve: {
      mainFields: ['module', 'main'],
      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
      extensions: ['.js', '.json'],
      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [root('src'), root('node_modules')],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
    module: {
      rules: [
        /* { test: /fields\.js$/, loader: 'file-loader', options: { name: '[name].[ext]' } }, */
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
          ],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
      ],
    },
  };
};
