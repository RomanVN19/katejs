import { use, apiUrl } from 'katejs';
import jwt from 'koa-jwt';
import Router from 'koa-router';
import User from './entities/User';
import Role from './entities/Role';
import { packageName } from './structure';
import allow, { getRole } from './allow';

const addMethodToRights = (method, rights) => {
  let entityRow = rights.find(item => item.entity === method.entity);
  if (!entityRow) {
    entityRow = { entity: method.entity };
    rights.push(entityRow);
  }
  entityRow[method.method] = entityRow[method.method] || method.access;
};

const AppServer = parent => class Server extends use(parent) {
  constructor(params) {
    super(params);
    this.entities.User = User;
    this.entities.Role = Role;
    // debug
    // this.setAuthParams({ jwtSecret: 'default' });
    this.publicAccessRules = [
      {
        entity: 'User',
        method: 'needAuthorization',
        access: true,
      },
      {
        entity: 'User',
        method: 'auth',
        access: true,
      },
      {
        entity: 'User',
        method: 'renew',
        access: true,
      },
      {
        entity: 'User',
        method: 'passwordRecovery',
        access: true,
      },
      {
        entity: 'User',
        method: 'passwordReset',
        access: true,
      },
      {
        entity: 'User',
        method: 'register',
        access: true,
      },
      {
        entity: 'User',
        method: 'profile',
        access: true,
      },
    ];
    this.accessRules = [];
    this.userTokenFields = [];
    this.mailMessages = {
      passwordRecovery: {
        subject: '%title% password recovery',
        body: `Someone requested password recovery on your account on %title%.
        Open link to reset password: %link%
        Or ignore this, if it wasn't you.
        `,
      },
    };
  }

  setAuthParams({ jwtSecret }) {
    this.jwtSecret = jwtSecret;
    this.httpMidlewares.push(jwt({ secret: jwtSecret, passthrough: true }));
    this.router = new Router();
    this.router.post(apiUrl, this.accessControl);
    this.httpMidlewares.push(this.router.routes());
  }

  async afterInit() {
    if (super.afterInit) super.afterInit();
    const { response: users } = await this.User.query();
    if (!users.length) {
      this.skipAuthorization = true;
    }
    this.updateRoles();
  }

  async updateRoles() {
    const { response: rolesQuery } = await this.Role.query({ data: { limit: -1 } });
    const roles = {};
    const rolesProps = {};
    rolesQuery.forEach((role) => {
      const { rights, methods, ...rest } = role;
      // add methods to rule
      methods.forEach(method => addMethodToRights(method, rights));
      this.publicAccessRules.forEach(method => addMethodToRights(method, rights));
      roles[role.uuid] = rights;

      rolesProps[role.uuid] = {};
      Object.keys(rest).forEach((prop) => {
        rolesProps[role.uuid][prop] = rest[prop];
      });
    });
    roles.public = [];
    this.publicAccessRules.forEach(method => addMethodToRights(method, roles.public));

    this.userRoles = roles;
    this.userRolesProps = rolesProps;
    this.logger.info('Roles updated');
  }

  allow(params, ruleSet, rule) {
    if (this.skipAuthorization) return true;
    const { ctx } = params;
    const { entity, method } = (ctx && ctx.params) || {};
    return allow({
      entity: ruleSet || entity,
      method: rule || method,
      user: ctx.state.user,
      userRoles: this.userRoles,
    });
  }

  getRole(entity, method) {
    return getRole({ entity, method, userRoles: this.userRoles });
  }

  accessControl = async (ctx, next) => {
    if (!this.allow({ ctx })) {
      ctx.body = { message: 'Access denied!' };
      ctx.status = ctx.state.user ? 403 : 401;
    } else {
      await next();
    }
  }
};
AppServer.package = packageName;
export default AppServer;
