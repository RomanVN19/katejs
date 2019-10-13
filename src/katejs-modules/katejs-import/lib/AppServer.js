import { use } from 'katejs';
import { packageName } from './structure';

import Import from './entities/Import';

const AppServer = parent => class Server extends use(parent) {
  constructor(params) {
    super(params);
    this.entities.Import = Import;
  }
};
AppServer.package = packageName;
export default AppServer;
