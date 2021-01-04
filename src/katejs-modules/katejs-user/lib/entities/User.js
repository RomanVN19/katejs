import { Entity, ApiError } from 'katejs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { structures } from '../structure';

const isOwnMethod = (method) => {
  switch (method) {
    case 'constructor':
    case 'get':
    case 'put':
    case 'query':
    case 'delete':
    case 'transaction':
    case 'beforePut':
    case 'afterPut':
      return false;
    default:
      return true;
  }
};

// ************
// Token logic
// Aims:
// 1. User remains loggen in forever if it use system more often than once a [month]
// 2. In case of token theft, intruder can use system no longer than [30 min]
// 3. In case of forced reauth, user can use system no longer than [30 min]
//
// Solution:
// 1. Client gots accessToken on auth, with [30min] expires time.
// Token stores per user device id in database.
// 2. If expired less than [month], token renew if equal to stored one.
// 3. In case of forced reauth storen tokens clears and user cant renew token
// 4. In case of token theft: user renew token and intruder cant renew, or intruder
// renew, then user reauth and intruder again cant rewnew.
// ************

const defaultExpires = 60 * 30; // seconds

class User extends Entity {
  constructor(params) {
    super(params);
    this.structure = structures.User;
    this.getToken.private = true;
  }

  needAuthorization() {
    return { response: { needAuthorization: !this.app.skipAuthorization } };
  }

  getEntities() {
    return { response: Object.keys(this.app.entities) };
  }

  getMethods() {
    const methods = [];
    const entities = Object.keys(this.app.entities);
    if (this.app.accessRules) {
      this.app.accessRules.forEach(rule => methods.push({ ...rule, access: true }));
    }
    entities.forEach((entityName) => {
      const entity = this.app[entityName];
      Object.getOwnPropertyNames(entity).forEach((key) => {
        if (typeof entity[key] === 'function' && isOwnMethod(key) && !entity[key].private) {
          if (this.app.publicAccessRules.find(rule => rule.entity === entityName
            && rule.method === key && rule.access) === undefined) {
            methods.push({
              entity: entityName,
              method: key,
              access: true,
            });
          }
        }
      });
      let classPrototype = Object.getPrototypeOf(entity);
      while (classPrototype !== Object.prototype) {
        // eslint-disable-next-line prefer-destructuring
        Object.getOwnPropertyNames(classPrototype).forEach((key) => {
          if (typeof entity[key] === 'function' && isOwnMethod(key) && !entity[key].private) {
            if (this.app.publicAccessRules.find(rule => rule.entity === entityName
              && rule.method === key && rule.access) === undefined) {
              methods.push({
                entity: entityName,
                method: key,
                access: true,
              });
            }
          }
        });

        classPrototype = Object.getPrototypeOf(classPrototype);
      }
    });
    return { response: methods };
  }

  async get(params) {
    const result = await super.get(params);
    result.response.passwordHash = undefined;
    if (result.response && params.ctx) {
      delete result.response.tokens;
    }
    return result;
  }

  static getHash = password => bcrypt.hash(password, 10);

  async beforePut({ body, savedEntity }) {
    if (!savedEntity || (body.username && (body.username !== savedEntity.username))) {
      const { response: presetUsers } = await this.query({
        data: { where: { username: body.username } },
      });
      if (presetUsers.length) {
        throw new ApiError({ message: 'User with this username/e-mail already exist' });
      }
    }
  }

  async put(params) {
    const { data: { body: { username }, uuid } } = params;
    if (!uuid) {
      const { response: presetUsers } = await this.query({ data: { where: { username } } });
      if (presetUsers.length) {
        return { error: { message: 'User with this e-mail already exist', status: 400 } };
      }
    }

    if (params.data.body.password1) {
      const passwordHash = await this.constructor.getHash(params.data.body.password1, 10);
      // eslint-disable-next-line no-param-reassign
      params.data.body.passwordHash = passwordHash;
    }
    const result = await super.put(params);
    if (result.response) {
      result.response.passwordHash = undefined;
    }
    return result;
  }

  async getToken(user, device) {
    this.logger.info('Issuing token for user', user.username);
    // eslint-disable-next-line no-param-reassign
    // user.rolesTitles = (user.roles || [])
    //   .map(({ role }) => (role ? role.title : undefined))
    //   .filter(item => item);
    const roles = (user.roles || [])
      .map(({ role }) => (role ? role.uuid : undefined))
      .filter(item => item);
    // eslint-disable-next-line no-param-reassign
    user.roles = roles;
    const { tokens } = user;
    // eslint-disable-next-line no-param-reassign
    delete user.tokens;

    const additionalFields = {};
    this.app.userTokenFields.forEach((field) => {
      if (typeof field === 'object') {
        additionalFields[field.field] = field.value(user);
      } else {
        additionalFields[field] = user[field];
      }
    });

    const result = {
      response: {
        message: 'OK',
        token: jwt.sign(
          {
            uuid: user.uuid,
            roles: user.roles,
            title: user.title,
            username: user.username,
            ...additionalFields,
          },
          this.app.jwtSecret,
          {
            expiresIn: this.app.jwtExpires || defaultExpires,
          },
        ),
        user,
        roles: this.app.userRoles,
        rolesProps: this.app.userRolesProps,
        device,
      },
    };

    let tokenRow = tokens.find(row => row.device === device);
    if (!tokenRow) {
      tokenRow = { device };
      tokens.push(tokenRow);
    }
    tokenRow.token = result.response.token;
    await this.put({ data: { uuid: user.uuid, body: { tokens } } });
    return result;
  }

  async auth({ data }) {
    this.logger.info('Auth attempt ', data.username);
    const { response: users } = await this.query({ data: { where: { username: data.username } } });
    if (users.length) {
      const user = users[0];
      if (user.inactive) {
        return { error: { message: 'User inactive!' } };
      }
      const passValid = await bcrypt.compare(data.password || '', user.passwordHash);
      delete user.passwordHash;
      if (passValid) {
        const device = data.device || 'no-device';
        const result = await this.getToken(user, device);
        return result;
      }
      return { error: { errorField: 'password' } };
    }
    return { error: { errorField: 'username' } };
  }

  async renew({ data }) {
    const { token, uuid } = data;
    const device = data.device || 'no-device';
    const { response: user } = await this.get({ data: { uuid } });
    const tokenRow = user.tokens.find(item => item.device === device);
    if (!tokenRow || tokenRow.token !== token) {
      return { error: { status: 401, error: 'no valid token' } };
    }
    const result = await this.getToken(user, device);
    return result;
  }

  async passwordRecovery({ data: { username, url } }) {
    if (!this.app.sendEmail) {
      return { error: { status: 400, message: 'No email service!' } };
    }
    const { response: users } = await this.query({ data: { where: { username } } });
    if (!users.length) {
      return { error: { status: 400, message: 'User does not exist!' } };
    }
    const passwordRecovery = crypto.randomBytes(16).toString('hex');
    const { error } = await this.put({ data: {
      uuid: users[0].uuid,
      body: {
        passwordRecovery,
      },
    } });
    if (error) {
      return { error: { status: 400, message: 'Error while password reset!' } };
    }
    const { title } = this.app.constructor;
    const link = `${this.app.env.systemUrl || url}/main/A/none/Auth?recovery=${passwordRecovery}&username=${username}`;
    return this.app.sendEmail({
      to: username,
      subject: this.app.mailMessages.passwordRecovery.subject.replace('%title%', title),
      body: this.app.mailMessages.passwordRecovery.body
        .replace('%title%', title).replace('%link%', link),
    });
  }

  async passwordReset({ data: { username, password, recovery } }) {
    if (!recovery) {
      return { error: { status: 400, message: 'Empty recovery code!' } };
    }
    const { response: users } = await this.query({ data: {
      where: { username, passwordRecovery: recovery },
    } });
    if (!users.length) {
      return { error: { status: 400, message: 'User does not exist or wrong recovery code!' } };
    }
    const passwordHash = await this.constructor.getHash(password);
    const { error } = await this.put({
      data: {
        uuid: users[0].uuid,
        body: {
          passwordHash,
          passwordRecovery: null,
        },
      },
    });
    if (error) {
      return { error: { status: 400, message: 'Error while password reset!' } };
    }
    return { response: { message: 'OK' } };
  }

  async query(params) {
    const result = await super.query(params);
    if (params && params.ctx && result.response) {
      // eslint-disable-next-line max-len
      result.response = result.response.map(item => ({ ...item, passwordHash: undefined, tokens: undefined }));
    }
    return result;
  }

  async register({ data, returnMailParams }) {
    this.logger.info('trying register user with params', data);
    const { url } = data;
    if (!this.app.userRegistrationRoleTitle) {
      return { error: { message: 'Registration role not defined', status: 400 } };
    }
    const { response: roles } = await this.app.Role.query({
      data: {
        where: { title: this.app.userRegistrationRoleTitle },
      },
    });
    if (!roles || !roles[0]) {
      return { error: { message: 'Registration role incorrect', status: 400 } };
    }
    let inactive = false;
    let code;
    if (this.app.userActivation) {
      inactive = true;
      code = crypto.randomBytes(16).toString('hex');
    }
    // check if user present
    const username = data.email.trim();
    const { error } = await this.put({
      data: {
        body: {
          ...data,
          title: data.name,
          username,
          roles: [{ role: roles[0] }],
          inactive,
          passwordRecovery: code,
        },
      },
    });
    if (error) {
      return { error };
    }
    if (code) {
      const { title } = this.app.constructor;
      const link = `${this.app.env.systemUrl || url}/main/A/none/Auth?code=${code}&username=${username}`;
      if (returnMailParams) {
        return { title, link };
      }
      await this.app.sendEmail({
        to: username,
        subject: this.app.mailMessages.activation.subject.replace('%title%', title),
        body: this.app.mailMessages.activation.body
          .replace('%title%', title).replace('%link%', link),
      });
    }
    return { response: { message: 'OK' } };
  }

  async profile({ ctx, data }) {
    if (!ctx || !ctx.state.user) {
      return { error: { status: 400, message: 'No valid token' } };
    }
    if (data && data.profile) {
      return this.put({ ctx, data: { uuid: ctx.state.user.uuid, body: data.profile } });
    }
    return this.get({ ctx, data: { uuid: ctx.state.user.uuid } });
  }

  async activate({ data }) {
    const { username, code } = data;
    if (!code) {
      return { error: { status: 400, message: 'Empty activation code!' } };
    }
    const { response: users } = await this.query({ data: {
      where: { username, passwordRecovery: code },
    } });
    if (!users.length) {
      return { error: { status: 400, message: 'User does not exist or wrong activation code!' } };
    }
    const { error } = await this.put({
      data: {
        uuid: users[0].uuid,
        body: {
          inactive: false,
        },
      },
    });
    if (error) {
      return { error: { status: 400, message: 'Error while activation!' } };
    }
    return { response: { message: 'OK' } };
  }

  async list() {
    const { response: users } = await this.query({ data: { limit: -1 }});
    return { response: users.map(item => item.username) };
  }
}

export default User;
