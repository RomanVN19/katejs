import { use } from 'katejs/lib/client';

import { structures, title, packageName } from './structure';
import FileItem from './forms/FileItem';

const AppClient = parent => class Client extends use(parent) {
  static title = title;
  constructor(params) {
    super(params);

    this.init({ structures, addToMenu: true });

    this.forms = {
      ...this.forms,
      FileItem: FileItem(this.forms.FileItem),
    };
  }
};
AppClient.package = packageName;
export default AppClient;
