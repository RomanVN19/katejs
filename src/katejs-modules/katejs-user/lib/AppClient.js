/* global localStorage */
import { use, Elements } from 'katejs/lib/client';
import icons from './icons';
import UserItemMixin from './forms/UserItemMixin';
import UserListMixin from './forms/UserListMixin';
import RoleItemMixin from './forms/RoleItemMixin';
import Auth from './forms/Auth';
import Registration from './forms/Registration';
import Profile from './forms/Profile';

import allowMethod from './allow';

import { structures, title, packageName } from './structure';

// saved auth check called right after constructor
// if need user in app constructor you can call this.checkSavedAuth
// This order of calls is for aply logic this.saveAuth = false;


const AppClient = parent => class Client extends use(parent) {
  static title = title;

  constructor(params) {
    super(params);
    this.entityMethods.User = ['needAuthorization', 'auth'];

    this.init({ structures, addToMenu: true });
    this.menu.forEach((item) => {
      if (icons[item.form]) {
        // eslint-disable-next-line no-param-reassign
        item.icon = icons[item.form];
      }
    });

    this.forms = {
      ...this.forms,
      Auth,
      Registration,
      Profile,
      UserItem: UserItemMixin(this.forms.UserItem),
      UserList: UserListMixin(this.forms.UserList),
      RoleItem: RoleItemMixin(this.forms.RoleItem),
    };
    this.userRoles = {};
    this.user = { roles: [] };
    this.setMenuParent = this.setMenu;
    this.setMenu = this.setMenuByRules;
    this.defaultLayout = {
      layout: 'main',
      areas: {
        leftMenu: 'none',
        alerts: 'A',
      },
    };
  }

  checkSavedAuth() {
    if (!this.saveAuth || this.authorization) return; // already checked or no needs
    const auth = localStorage.getItem(`${packageName}-auth`);
    const device = localStorage.getItem(`${packageName}-device`);
    if (auth) {
      try {
        const { token, user, roles, rolesProps } = JSON.parse(auth);
        this.successAuth({ token, user, roles, rolesProps, device, skipRedirect: true, skipAfterInitCall: true });
      } catch (error) {
        this.showAlert({ type: 'warning', title: JSON.stringify(error) });
      }
    }
  }

  async renewToken() {
    if (this.renewTokenPromise) {
      await this.renewTokenPromise;
      this.renewTokenPromise = undefined;
      return;
    }
    this.renewTokenPromise = new Promise(async (resolve) => {
      const newTokenResponse = await this.User.renew({
        uuid: this.user.uuid,
        token: this.authorization,
        device: this.authorizationDevice,
      });
      if (newTokenResponse.response) {
        this.successAuth({ ...newTokenResponse.response, skipRedirect: true });
      } else {
        this.logout();
      }
      resolve();
    });
  }

  async request(url, params, handlers) {
    if (this.authorization) {
      const requestParams = {
        ...params,
        headers: {
          authorization: `Bearer ${this.authorization}`,
        },
      };
      const result = await super.request(url, requestParams, handlers);
      if (result.error && result.errorResponse && result.errorResponse.status === 401 && !url.endsWith('/User/renew')) {
        await this.renewToken();
        if (this.authorization) {
          return this.request(url, requestParams, handlers);
        } else {
          return { error: { message: 'token not valid' } };
        }
      }
      return result;
    }
    return super.request(url, params, handlers);
  }
  async checkNeedAuthorization() {
    const { response } = await this.User.needAuthorization();
    // check again - flag can be changed by some form contructor
    if (this.skipAuthorization) return;
    this.skipAuthorization = response && !response.needAuthorization;
    if (!this.skipAuthorization) {
      // this.setMenu([]);
      // this.open('none', null, 'leftMenu');
      this.open('Auth');
    } else {
      this.open('M', undefined, 'leftMenu');
      this.setMenuParent(this.menu);
    }
  }
  async afterInit() {
    if (super.afterInit) await super.afterInit();
    this.checkSavedAuth();
    if (this.afterUserInit && this.authorization) await this.afterUserInit();
    if (!this.authorization && !this.skipAuthorization) {
      // no await! need to catch skipAuthorization flag in Registration and other forms
      this.checkNeedAuthorization();
    }
  }

  logout = () => {
    this.authorization = undefined;
    this.user = undefined;
    this.userRoles = undefined;
    this.open('none', undefined, 'leftMenu');
    this.open('Auth');
    localStorage.removeItem(`${packageName}-auth`);
  };

  async successAuth({ token, user, roles, rolesProps, skipRedirect, device, skipAfterInitCall }) {
    this.authorization = token;
    this.authorizationDevice = device;
    this.user = user;
    this.userRoles = roles;
    this.userRolesProps = rolesProps;
    this.skipAuthorization = false;

    const profileItem = this.menu.find(item => item.form === 'Profile');
    if (!profileItem) {
      this.menu.push({
        title: this.t('Profile'),
        form: 'Profile',
        icon: icons.Profile,
      });
    }

    const logoutItem = this.menu.find(item => item.onClick === this.logout);
    if (!logoutItem) {
      this.menu.push({
        title: this.t('Logout'),
        onClick: this.logout,
        icon: icons.Logout,
      });
    }

    const topElements = [
      {
        id: 'userTitle',
        type: Elements.LABEL,
        tag: 'h4',
        title: user.title,
      },
    ];
    if (user.roles && user.roles[0] && this.userRolesProps) {
      topElements.push({
        id: 'userRole',
        type: Elements.LABEL,
        tag: 'h6',
        title: this.userRolesProps[user.roles[0]].title,
      });
    }

    if (!skipAfterInitCall && this.afterUserInit) await this.afterUserInit();

    const { forms } = this.getLayout();
    if (forms.leftMenu !== 'M') {
      this.open('M', undefined, 'leftMenu');
    }
    this.setMenu(this.menu, topElements);

    if (!skipRedirect) {
      const firstForm = this.menu.find(menuItem => !menuItem.rule || this.allow(menuItem.rule));
      if (firstForm) {
        this.open(firstForm.form);
      }
    }

    if (this.saveAuth) {
      localStorage.setItem(`${packageName}-auth`, JSON.stringify({ token, user, roles, rolesProps }));
      localStorage.setItem(`${packageName}-device`, this.authorizationDevice);
    }
  }

  allow(entity, method) {
    if (this.skipAuthorization) return true;
    if (typeof entity === 'object') {
      return allowMethod({
        entity: entity.entity,
        method: entity.method,
        user: this.user,
        userRoles: this.userRoles,
      });
    }
    return allowMethod({
      entity,
      method,
      user: this.user,
      userRoles: this.userRoles,
    });
  }

  setMenuByRules = (menu, topElements) => {
    let filteredMenu;
    if (menu) {
      filteredMenu = menu.map((menuItemOrigin) => {
        const menuItem = { ...menuItemOrigin };
        if (menuItem.submenu) {
          // eslint-disable-next-line no-param-reassign
          menuItem.submenu = menuItem.submenu.filter((submenuItem) => {
            if (!submenuItem.rule) return true;
            return this.allow(submenuItem.rule);
          });
        }
        if (!menuItem.rule || this.allow(menuItem.rule)) return menuItem;
        return false;
      }).filter(item => item);
    }
    this.setMenuParent(filteredMenu, topElements);
  }
};
AppClient.package = packageName;
export default AppClient;
