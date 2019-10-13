import { use } from 'katejs/lib/client';

import ActionLogList from './forms/ActionLogList';
import ActionLogItem from './forms/ActionLogItem';
import { structures, title, packageName } from './structure';

const AppClient = parent => class Client extends use(parent) {
  static title = title;
  constructor(params) {
    super(params);

    this.menu.push({
      title: 'Logs',
      form: 'ActionLogList',
      rule: {
        entity: 'ActionLog',
        method: 'query',
      },
    });
    this.makeApiLinks({ entities: Object.keys(structures) });

    this.forms.ActionLogList = ActionLogList;
    this.forms.ActionLogItem = ActionLogItem;
  }
};
AppClient.package = packageName;
export default AppClient;
