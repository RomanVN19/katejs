import { use } from 'katejs/lib/client';

import { packageName, structures } from './structure';

const AppClient = parent => class Client extends use(parent) {
  constructor(args) {
    super(args);
    this.init({ structures, addToMenu: true });
    this.makeApiLinks({ entities: ['Print'] });
  }
  async print({ template, data }) {
    const { response } = await this.Print.print({ template, data });
    if (response) {
      const win = window.open('', 'Print');
      win.document.write(response.data);
    }
  }
};

AppClient.package = packageName;
export default AppClient;
