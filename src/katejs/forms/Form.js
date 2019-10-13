import { Form } from 'kate-client';
import { Elements } from 'kate-form-material-kit-react';

export default class KateJSForm extends Form {
  static checkIdPresence(data, path) {
    (data || []).forEach((item) => {
      if (!item.id) {
        console.error('Missing id of ', item, ' in ', path); // eslint-disable-line no-console
      }
    });
  }
  init() {
    KateJSForm.checkIdPresence(this.actions, 'form actions');
    KateJSForm.checkIdPresence(this.elements, 'form element');

    const formData = {
      id: 'form',
      type: Elements.CARD,
      elements: [
        ...this.elements,
      ],
      title: this.constructor.title,
    };
    if (this.actions) {
      formData.elements.push({
        id: 'actions',
        type: Elements.CARD_ACTIONS,
        elements: this.actions,
      });
    }
    super.init(formData);
  }
}
