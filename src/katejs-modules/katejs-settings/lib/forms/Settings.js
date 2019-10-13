import { Form, Elements, getElement } from 'katejs/lib/client';

export default class Settings extends Form {
  static title = 'Settings';
  constructor(args) {
    super(args);
    this.elements = [];
    this.app.settingsParams.fields.forEach(item => this.elements.push(getElement(item, this)));
    this.elements.push({
      type: Elements.BUTTON,
      title: 'Apply',
      onClick: this.apply,
    });
    this.load();
  }
  apply = () => {
    this.app.Settings.set(this.getValues());
  }
  async load() {
    const { response: settings } = await this.app.Settings.get();
    this.setValues(settings);
  }
}
