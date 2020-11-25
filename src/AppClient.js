import { use } from 'katejs/lib/client';
import { AppDoc, AppUser, AppSettings, AppFiles } from 'katejs-modules/lib/client';

import { structures, title, packageName, Settings } from './structure';
import env from './front.env.json';

import IncomeFormMixin from './forms/IncomeItemMixin';
import IncomeReport from './forms/IncomeReport';
import ExpenseItemMixin from './forms/ExpenseItemMixin';
import ExpenseReport from './forms/ExpenseReport';
import MoneyReport from './forms/MoneyReport';
import TestForm from './forms/TestForm';
import icons from './icons';

const AppClient = parent => class Client extends use(parent, AppDoc, AppUser, AppSettings, AppFiles) {
  static title = title;
  static useLogger = false;

  constructor(params) {
    super(params);
    this.baseUrl = env.apiUrl || '/api';

    this.init({ structures, addToMenu: true });
    this.forms = {
      ...this.forms,
      IncomeItem: IncomeFormMixin(this.forms.IncomeItem),
      ExpenseItem: ExpenseItemMixin(this.forms.ExpenseItem),
      IncomeReport,
      ExpenseReport,
      MoneyReport,
      TestForm,
    };
    this.forms.IncomeList.doc = true;
    this.forms.ExpenseList.doc = true;
    this.menu.push(
      {
        form: 'TestForm',
        title: 'Test form',
      },
      {
        form: 'IncomeReport',
        title: 'Income report',
      },
      {
        form: 'ExpenseReport',
        title: 'Expense report',
      },
      {
        form: 'MoneyReport',
        title: 'Money report',
      },
    );
    this.saveAuth = true;

    this.settingsParams = Settings;

    this.menu.unshift(
      {
        title: 'Reports',
        icon: icons.OrderDynamics,
        submenu: [
          {
            form: 'ProductSalesReport',
            title: 'Product sales',
          },
          {
            form: 'OrdersToDeliverReport',
            title: 'Orders to deliver',
          },
          {
            form: 'CashFlow',
            title: 'Cash flow',
          },
          {
            form: 'OrderDynamics',
            title: 'Order dynamics',
          },
          {
            form: 'ProductFlowReport',
            title: 'Product flow',
          },
          {
            form: 'DebtFlowReport',
            title: 'Взаиморасчеты',
          },
        ],
      },
    );
    this.menu.forEach((item) => {
      if (item.form === 'UserList') {
        item.rule = {
          entity: 'User',
          method: 'put',
        };
      }
      if (icons[item.form]) {
        // eslint-disable-next-line no-param-reassign
        item.icon = icons[item.form];
      }
      if (item.submenu) {
        item.submenu.forEach((sitem) => {
          if (icons[sitem.form]) {
            // eslint-disable-next-line no-param-reassign
            sitem.icon = icons[sitem.form];
          }
        });
      }
    });
  }
  // async afterInit() { // test open with link
  //   await super.afterInit();
  //   await new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //     }, 500);
  //   });
  //   this.forms.ExpenseItem = ExpenseItemMixin(this.forms.ExpenseItem); // test mixin after init
  // }
  async afterUserInit() {
    if (super.afterUserInit) await super.afterUserInit();
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
    console.log('after user init');
  }
};
AppClient.package = packageName;
export default AppClient;
