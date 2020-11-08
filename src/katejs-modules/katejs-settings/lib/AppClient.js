import { use } from 'katejs/lib/client';
import { packageName } from './structure';
import Settings from './forms/Settings';
import icons from './icons';


const AppClient = parent => class Client extends use(parent) {
  constructor(args) {
    super(args);
    this.forms.Settings = Settings;
    this.makeApiLinks({ entities: ['Settings'] });
    this.menu.push({
      form: 'Settings',
      title: 'Settings',
      rule: {
        entity: 'Settings',
        method: 'put',
      },
      icon: icons.Settings,
    });
    this.settings = {};
  }
  async afterInit() {
    if (super.afterInit) await super.afterInit();
    if (!this.successAuth) await this.updateSettings();
  }
  // reload settings on user auth
  async afterUserInit() {
    if (super.afterUserInit) await super.afterUserInit();
    await this.updateSettings();
  }
  async updateSettings() {
    const { response: settings } = await this.Settings.get();
    this.settings = settings;
  }
};

AppClient.package = packageName;
export default AppClient;
