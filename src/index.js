/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import webpack from 'webpack';
import fs from 'fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Server from './KateServer';

import Fields from './fields';
import { makeEntitiesFromStructures, trivialLogger } from './server';
import Entity from './Entity';

export default class KateJS {
  constructor({ AppServer, logger, database, http, env }) {
    this.logger = logger || trivialLogger;
    this.AppServer = AppServer;
    this.database = database;
    this.http = http;
    this.env = env;
  }
  createServer() {
    this.server = new Server(this);
  }
  syncDatabase() {
    this.createServer();
    this.server.syncDatabase();
  }
  startServer() {
    this.createServer();
    this.server.run();
  }
  compileClient() {
    this.logger.info('Compiling client...');
    webpack({
      entry: './src/index.js',
      output: {
        path: `${process.cwd()}/build`,
        filename: './bundle/bundle.js',
      },
      plugins: [
        new ExtractTextPlugin('./bundle/bundle.css'),
      ],
      module: {
        rules: [{
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
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          }),
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
        }],
      },
      devtool: 'source-map',
    }, (err, stats) => {
      if (err || stats.hasErrors()) {
        const info = stats.toJson();
        this.logger.info('Client compiling error!', info.errors);
      } else {
        this.makeIndex();
        this.logger.info('...client compiling done!');
      }
    });
  }
  makeIndex() {
    const index = fs.readFileSync(`${__dirname}/index.html`, { encoding: 'utf8' });
    fs.writeFileSync(`${process.cwd()}/build/index.html`, index.replace('%app_title%', this.server.app.constructor.title), { encoding: 'utf8' });
  }
}

const use = (parent, ...classes) => {
  let result = parent;
  result.packages = result.packages || [];
  (classes || []).forEach((Package) => {
    if (result.packages.indexOf(Package.package) === -1) {
      result.packages.push(Package.package);
      result = Package(result);
    }
  });
  return result;
};

class ApiError extends Error {
  constructor({ message, status = 400 }) {
    super();
    this.status = status;
    this.message = message;
  }
}

export {
  Fields,
  Entity,
  makeEntitiesFromStructures,
  use,
  ApiError,
  Server,
};
