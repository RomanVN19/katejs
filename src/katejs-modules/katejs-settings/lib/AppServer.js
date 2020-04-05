import { use, makeEntitiesFromStructures } from 'katejs';
import { packageName, structures } from './structure';

import SettingsMixin from './entities/SettingsMixin';

const AppServer = parent => class Server extends use(parent) {
  constructor(params) {
    super(params);
    makeEntitiesFromStructures(this.entities, structures);
  }
  beforeInit() {
    if (super.beforeInit) super.beforeInit();
    // add settings fields from app
    this.entities.Settings = SettingsMixin(this.entities.Settings, this.settingsParams);
  }
};
AppServer.package = packageName;
export default AppServer;
