import { use } from 'katejs/lib/client';
import icons from './icons';
import WhatsNew from './forms/WhatsNew';

import { packageName, structures } from './structure';

const AppClient = parent => class Client extends use(parent) {
  constructor(args) {
    super(args);
    this.init({ structures, addToMenu: true });
    this.forms.WhatsNew = WhatsNew;
    this.menu.push({
      form: 'WhatsNew',
      icon: icons.WhatsNew,
      title: 'What\'s new',
    });
    this.docsAccessFilter = () => true;
    this.docsContent = [];
  }
};

AppClient.package = packageName;
export default AppClient;
