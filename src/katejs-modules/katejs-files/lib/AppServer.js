import { makeEntitiesFromStructures, use, apiUrl } from 'katejs';
import path from 'path';
import fs from 'fs';
import Router from 'koa-router';
import { packageName, structures } from './structure';

import File from './entities/File';

const AppServer = parent => class Server extends use(parent) {
  constructor(params) {
    super(params);
    makeEntitiesFromStructures(this.entities, structures);
    this.entities = {
      ...this.entities,
      File: File(this.entities.File),
    };
    this.filesUploadDir = 'upload';
    const router = new Router();
    router.get('/api/file/:uuid/:filename', this.serveFile);
    this.httpMidlewares.push(router.routes());
  }
  async afterInit() {
    if (super.afterInit) {
      await super.afterInit();
    }
    this.filesUploadPath = path.join(process.cwd(), this.filesUploadDir);
    try {
      fs.statSync(this.filesUploadPath);
    } catch {
      fs.mkdirSync(this.filesUploadPath);
    }
  }
  serveFile = async(ctx) => {
    ctx.body = fs.createReadStream(path.join(this.filesUploadPath, ctx.params.uuid));
  }
};
AppServer.package = packageName;
export default AppServer;
