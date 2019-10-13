import { makeEntitiesFromStructures, use } from 'katejs';

import { packageName, structures } from './structure';

const AppServer = parent => class Server extends use(parent) {
  constructor(args) {
    super(args);
    makeEntitiesFromStructures(this.entities, structures);
    if (this.publicAccessRules) {
      this.publicAccessRules.push({
        entity: 'EntityDescription',
        method: 'query',
        access: true,
      });
    }
  }
};
AppServer.package = packageName;
export default AppServer;
