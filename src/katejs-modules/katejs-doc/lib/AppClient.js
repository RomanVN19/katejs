import { use } from 'katejs/lib/client';

import DocItem from './forms/DocItem';
import DocList from './forms/DocList';

import { packageName } from './structure';


const AppClient = parent => class Client extends use(parent) {
  constructor(args) {
    super(args);
    this.docPeriodFilters = {};
  }
  afterInit() {
    if (super.afterInit) super.afterInit();
    Object.keys(this.forms).forEach((formName) => {
      if (formName.endsWith('Item') && this.forms[formName].doc) {
        this.forms[formName] = DocItem(this.forms[formName]);
      }
      if (formName.endsWith('List') && this.forms[formName].doc) {
        this.forms[formName] = DocList(this.forms[formName]);
      }
    });
  }
};

AppClient.package = packageName;
export default AppClient;
