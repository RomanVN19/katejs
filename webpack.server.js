const nodeExternals = require('webpack-node-externals');
const path = require('path');
const ROOT = path.resolve(__dirname);
const root = path.join.bind(path, ROOT);

module.exports = function (env) {
  return {
    mode: 'production',
    target: 'node',
    entry: {
      index: './src/index.js',
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
    module: {
      rules: [
        /* { test: /fields\.js$/, loader: 'file-loader', options: { name: '[name].[ext]' } }, */
        { test: /\.js$/, loader: 'babel-loader' },
      ],
    },
  };
};
