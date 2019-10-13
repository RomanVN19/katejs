import { use } from 'katejs/lib/client';

import Import from './forms/Import';
import { packageName } from './structure';

const AppClient = parent => class Client extends use(parent) {
  constructor(params) {
    super(params);

    this.menu.push({
      title: 'Import',
      form: 'Import',
      rule: {
        entity: 'Import',
        method: 'import',
      },
    });
    this.entityMethods.Import = ['import'];
    this.makeApiLinks({ entities: ['Import'] });

    this.forms.Import = Import;
  }
};
AppClient.package = packageName;
export default AppClient;
