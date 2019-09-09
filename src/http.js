
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

import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import Static from 'koa-static';
import Send from 'koa-send';

export const apiUrl = '/api/:entity/:method';

const noEntityResponse = (ctx) => {
  ctx.body = { message: 'Can\'t find entity' };
  ctx.status = 404;
};

const noMethodResponse = (ctx) => {
  ctx.body = { message: 'Can\'t find entity method' };
  ctx.status = 404;
};


export default class Http {
  constructor({ httpParams, logger, entities, middlewares }) {
    this.app = new Koa();
    this.logger = logger;
    this.httpParams = httpParams;
    this.entities = entities;
    if (httpParams.cors !== false) {
      this.app.use(async (ctx, next) => {
        ctx.vary('Origin');
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Expose-Headers', '*');
        if (ctx.method !== 'OPTIONS') {
          await next();
        } else {
          ctx.set('Access-Control-Allow-Methods', '*');
          ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
          ctx.status = 204;
        }
      });
    }
    this.app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      logger.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}`);
    });
    this.app.use(koaBody({ multipart: true }));
    middlewares.forEach(middleware => this.app.use(middleware));
    this.router = new Router();

    this.router.post(apiUrl, this.api);
    this.router.get('/static/*', (ctx) => {
      // for old bundles files
      ctx.body = { message: 'Not found' };
      ctx.status = 404;
    });

    this.app.use(Static(`${process.cwd()}/build`, { hidden: true }));
    this.app.use(this.router.routes());
    this.app.use(async (ctx) => {
      await Send(ctx, '/build/index.html', process.cwd());
    });
  }
  listen() {
    this.app.listen(this.httpParams.port, this.httpParams.host || '0.0.0.0');
  }
  api = async (ctx) => {
    this.logger.debug('api request', ctx.params, ctx.request.body);
    const { entity, method } = ctx.params;
    const data = ctx.request.body;
    const entityObject = this.entities[entity];
    if (!entityObject) {
      noEntityResponse(ctx);
      return;
    }
    if (typeof entityObject[method] !== 'function') {
      noMethodResponse(ctx);
      return;
    }

    const { response, error, headers } = (await entityObject[method]({ data, ctx })) || { error: { message: 'no response'}};
    ctx.body = response || error;
    ctx.status = error ? (error.status || 500) : 200;
    if (headers) {
      Object.keys(headers).forEach(header => ctx.set(header, headers[header]));
    }
  }
}
