import { makeEntitiesFromStructures, use } from 'katejs';
import { AppDoc, AppUser, AppSettings } from 'katejs-modules';
import { structures, title, packageName, Settings } from './structure';

import ExpenseMixin from './entities/ExpenseMixin';
import IncomeMixin from './entities/IncomeMixin';

const AppServer = parent => class Server extends use(parent, AppDoc, AppUser, AppSettings) {
  static title = title;

  constructor(params) {
    super(params);
    makeEntitiesFromStructures(this.entities, structures);

    this.setAuthParams({ jwtSecret: this.env.jwtSecret || 'default' });

    this.entities = {
      ...this.entities,
      Expense: ExpenseMixin(this.entities.Expense),
      Income: IncomeMixin(this.entities.Income),
    };
    this.entities.MoneyRecord.record = true;

    this.settingsParams = Settings;
  }
};
AppServer.package = packageName;
export default AppServer;
