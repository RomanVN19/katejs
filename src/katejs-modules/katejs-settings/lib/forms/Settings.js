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
      onClick: () => this.apply(),
    });
    this.load();
  }
  async apply() {
    const result = await this.app.Settings.set(this.getValues());
    if (result.error) {
      this.app.showAlert({ type: 'warning', title: 'Error', description: result.error.message });
    } else {
      this.app.showAlert({ type: 'success', title: 'Saved!' });
    }
  }
  async load() {
    const { response: settings } = await this.app.Settings.get();
    this.setValues(settings);
  }
}
