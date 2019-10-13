import { makeEntitiesFromStructures, use } from 'katejs';
import Print from './entities/Print';
import { packageName, structures } from './structure';

const AppServer = parent => class Server extends use(parent) {
  constructor(args) {
    super(args);
    makeEntitiesFromStructures(this.entities, structures);
    this.entities.Print = Print;
    if (this.publicAccessRules) {
      this.publicAccessRules.push({
        entity: 'Print',
        method: 'print',
        access: true,
      });
    }
  }
};
AppServer.package = packageName;
export default AppServer;
