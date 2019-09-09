
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

import ProxyPolyfill from 'proxy-polyfill/src/proxy';
import { App } from 'kate-client';
import { Layout, components } from 'kate-form-material-kit-react';

import { makeItemForm, makeListForm } from '../client';
import Menu, { menuForm } from './Menu';
import Alerts, { showAlert } from './Alerts';

const ProxyP = ProxyPolyfill();

const makeFormsFromStructure = ({ structures, menu, forms: allForms, addToMenu }) => {
  Object.keys(structures).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    allForms[`${key}Item`] = makeItemForm({ structure: structures[key], name: key });
    // eslint-disable-next-line no-param-reassign
    allForms[`${key}List`] = makeListForm({ structure: structures[key], name: key });
    if (menu && addToMenu) {
      menu.unshift({ // add last app forms to top
        title: allForms[`${key}List`].title,
        form: `${key}List`,
      });
    }
  });
  return allForms;
};


export default class PlatformApp extends App {
  static package = 'katejs';
  static packages = ['katejs'];
  static path = '/';
  static title = 'KateJS';
  static components = components;
  constructor(params) {
    super(params);
    this.baseUrl = '/api';
    this.paginationLimit = 20;
    this.layouts = {
      main: {
        component: Layout,
        areas: {
          main: { default: true },
          leftMenu: {},
          alerts: {},
        },
      },
    };
    this.defaultLayout = {
      layout: 'main',
      areas: {
        leftMenu: 'M',
        alerts: 'A',
      },
    };
    this.forms = { M: Menu, A: Alerts };
    this.drawerOpen = true;
    this.loading = false;

    this.entityMethods = {}; // for Proxy polyfill
  }
  setDrawer(drawerOpen) {
    this.drawerOpen = drawerOpen;
    this.layoutComponent.forceUpdate();
  }

  loaderOn() {
    setTimeout(() => {
      this.loading = true;
      this.layoutComponent.forceUpdate();
    }, 0);
  }

  loaderOff() {
    setTimeout(() => {
      this.loading = false;
      this.layoutComponent.forceUpdate();
    }, 0);
  }

  setMenu(menu, topElements) {
    if (menu) {
      if (this[menuForm]) {
        this[menuForm].setMenu(menu);
      } else { // to process setMenu from constructor
        setTimeout(() => {
          if (this[menuForm]) {
            this[menuForm].setMenu(menu);
          }
        }, 0);
      }
    }
    if (topElements) {
      if (this[menuForm]) {
        this[menuForm].setTopElements(topElements);
      } else {
        setTimeout(() => {
          if (this[menuForm]) {
            this[menuForm].setTopElements(topElements);
          }
        });
      }
    }
  }
  showAlert(params) {
    if (this[showAlert]) {
      this[showAlert](params);
    }
  }
  init({ structures, addToMenu }) {
    this.menu = this.menu || [];
    makeFormsFromStructure({
      structures,
      menu: this.menu,
      forms: this.forms,
      addToMenu,
    });
    this.makeApiLinks({ entities: Object.keys(structures) });
  }
  /* global FormData */
  makeApiLinks({ entities }) {
    const app = this;
    const methods = this.entityMethods;
    entities.forEach((entity) => {
      const proxyHandlers = {
        get(target, prop) {
          return (data, handlers) => app.request(`${app.baseUrl}/${entity}/${prop}`, {
            method: 'post',
            body: data instanceof FormData ? data : JSON.stringify(data),
          }, handlers);
        },
        set() {
          return true;
        },
      };
      if (window.Proxy) {
        this[entity] = new Proxy({}, proxyHandlers);
      } else {
        // set entity methods to proxy polyfill
        const entityMethods = { get: true, query: true, put: true, delete: true };
        if (methods[entity]) {
          methods[entity].forEach((method) => {
            entityMethods[method] = true;
          });
        }
        this[entity] = new ProxyP(entityMethods, proxyHandlers);
      }
    });
  }
}
