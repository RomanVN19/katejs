import { makeEntitiesFromStructures, use, apiUrl } from 'katejs';
import Router from 'koa-router';
import { packageName, structures } from './structure';

const shallowDiff = (src = {}, dst) => {
  const diff = [];
  Object.keys(dst).forEach((field) => {
    if (typeof dst[field] === 'object' && dst[field]) { // check ref
      if (dst[field].uuid !== (src[field] && src[field].uuid)) {
        diff.push({
          field,
          previous: src[field],
          current: { title: dst[field].title, uuid: dst[field].uuid },
        });
      }
    } else if (src[field] !== dst[field]) {
      diff.push({
        field,
        previous: src[field],
        current: dst[field],
      });
    }
  });
  return diff;
};

const AppServer = parent => class Server extends use(parent) {
  constructor(params) {
    super(params);
    makeEntitiesFromStructures(this.entities, structures);
    this.router = new Router();
    this.router.post(apiUrl, this.apiLog);
    this.httpMidlewares.push(this.router.routes());
    // this.actionLogParams = {
    //   exceptMethods: ['query', 'get'],
    //   log: (ctx, log) => { log.data = ctx.request.body },
    // };
  }
  apiLog = async (ctx, next) => {
    await next();
    const { entity, method } = ctx.params;

    const { exceptMethods, log: logFunc } = this.actionLogParams || {};
    if (exceptMethods && exceptMethods.indexOf(method) > -1) return;

    const log = {
      entity,
      method,
    };
    if (ctx.state.user) {
      const { title, uuid } = ctx.state.user;
      log.userTitle = title;
      log.userId = uuid;
    }
    log.status = ctx.response.status;
    if (log.status === 200 && (method === 'get' || method === 'put')) {
      const { title, uuid } = ctx.body;
      log.objectTitle = title;
      log.objectId = uuid;
      if (method === 'put') {
        log.data = {
          shallowDiff: shallowDiff(ctx.state.savedEntity, ctx.request.body.body || {}),
        };
      }
    }
    if (logFunc) await logFunc(ctx, log);

    if (typeof log.data === 'object') log.data = JSON.stringify(log.data);

    await this.ActionLog.put({ data: { body: log } });
  }
};
AppServer.package = packageName;
export default AppServer;
