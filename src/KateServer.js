/* eslint-disable no-console */

/*
Copyright © 2018 Roman Nep <neproman@gmail.com>

This file is part of KateJS.

KateJS is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

KateJS is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with KateJS.  If not, see <https://www.gnu.org/licenses/>.
*/

import Database from './database';
import Http from './http';

const trivialLogger = {
  info: (...args) => console.log(...args),
  debug: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
};
const terms = Symbol('terms');

class AppServer {
  constructor({ logger, env, translations }) {
    this.logger = logger;
    this.env = env;
    this.entities = {};
    this.httpMidlewares = [];
    this.paginationLimit = 20;
    this[terms] = translations && translations[translations.languages[0]];
  }
  t = (strings, ...keys) => {
    if (!strings) return '';
    if (typeof strings === 'string') {
      if (!this[terms]) return strings;
      return this[terms][strings] || strings;
    }
    // using as tag
    const result = [];
    keys.forEach((key, index) => {
      result.push((this[terms] && this[terms][strings[index]]) || strings[index]);
      result.push(key);
    });
    result.push((this[terms] && this[terms][strings[strings.length - 1]]) 
      || strings[strings.length - 1]);
    return result.join('');
  }
}

export default class KateServer {
  constructor({ AppServer: App, logger, database: databaseParams, http: httpParams, env, translations }) {
    this.logger = logger || trivialLogger;

    this.logger.info('Creating KateServer...');
    this.app = new (App(AppServer))({ logger: this.logger, env, translations });
    const { entities: entitiesClasses } = this.app;
    const entities = {};
    if (this.app.beforeInit) this.app.beforeInit();
    Object.keys(entitiesClasses).forEach((name) => {
      entities[name] = new entitiesClasses[name]({ logger: this.logger, app: this.app });
      this.app[name] = entities[name];
    });
    this.entities = entities;
    this.httpParams = httpParams;
    if (databaseParams) {
      this.database = new Database({ databaseParams, entities, logger: this.logger });
    }
  }
  async run() {
    const { entities, httpParams } = this;

    this.http = new Http({
      httpParams,
      entities,
      logger: this.logger,
      middlewares: this.app.httpMidlewares,
    });

    Object.keys(entities).forEach((name) => {
      if (entities[name].afterInit) entities[name].afterInit();
    });
    if (this.app.afterInit) this.app.afterInit();

    await this.database.init();
    this.logger.info('starting http server...');
    this.http.listen();
    this.logger.info('... http server started at port', this.http.httpParams.port);
  }
  async syncDatabase() {
    if (this.database) {
      this.logger.info('synchronizing database structure...');
      try {
        await this.database.sync();
        this.logger.info('...database structure synchronized');
      } finally {
        process.exit(0);
      }
    } else {
      this.logger.info('No database params!');
    }
  }
}
