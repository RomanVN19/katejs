import { Form } from 'kate-client';
import { Elements } from 'kate-form-material-kit-react';

export const menuForm = Symbol('menuForm');

export default class Menu extends Form {
  constructor(params) {
    super(params);
    this.elements = [{
      id: 'menu',
      type: Elements.LayoutMenu,
      elements: this.getMenuElements(this.app.menu),
      classes: this.app.layoutClasses,
      drawerOpen: true,
      switchDrawer: this.switchDrawer,
      title: this.app.constructor.title,
      logo: this.app.constructor.logo,
      fullLogo: this.app.constructor.fullLogo,
      brandClick: this.app.brandClick || (() => this.onClick({ form: 'none' })),
      topElements: [],
    }];
    this.app[menuForm] = this;
    this.app.drawer = this.content;
  }
  switchDrawer = () => {
    this.content.menu.drawerOpen = !this.content.menu.drawerOpen;
    this.app.setDrawer(this.content.menu.drawerOpen);
  }
  onClick = (item) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    this.app.open(item.form);
    this.content.menu.elements = this.content.menu.elements
      .map(menuItem => ({
        ...menuItem,
        current: menuItem.key === (item.form || item.onClick),
        submenu: menuItem.submenu
          ? menuItem.submenu.map(subItem => ({
            ...subItem,
            current: subItem.key === (item.form || item.onClick),
          })) : null,
      }));
  }
  getMenuElements(menu) {
    return menu.map(item => ({
      title: item.title,
      key: item.form || item.onClick,
      icon: item.icon,
      submenu: item.submenu ? this.getMenuElements(item.submenu) : null,
      form: item.form,
      onClick: () => this.onClick(item),
      badge: item.badge,
    }));
  }
  setMenu = (menu) => {
    this.content.menu.elements = this.getMenuElements(menu);
  }
  setTopElements = (elements) => {
    this.content.menu.topElements = elements;
  }
}
