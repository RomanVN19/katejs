import { Elements } from '../kate-form-material-kit-react';
import Form from './Form';
import { ConfirmDialog } from './Dialogs';
import { getElement, getTableElement, makeTitle } from '../shared';


const makeItemForm = ({ structure, name, addActions = true, addElements = true }) =>
  class ItemForm extends Form {
    static title = makeTitle(name);
    static structure = structure;
    static entity = name;
    constructor(args) {
      super(args);
      const { params } = args;

      if (addElements) {
        const elements = (structure.fields || [])
          .filter(field => !field.skipForForm)
          .map(field => getElement(field, this));
        (structure.tables || [])
          .filter(table => !table.skipForForm)
          .forEach(table => elements.push(getTableElement(table, this)));
        this.elements = elements;
      } else {
        this.elements = [];
      }
      this.elements.push(ConfirmDialog({ form: this, id: 'confirmDialog' }));

      if (addActions) {
        this.actions = [
          {
            id: '__OK',
            type: Elements.BUTTON,
            title: 'OK',
            onClick: () => this.ok(),
            disabled: false,
          },
          {
            id: '__Save',
            type: Elements.BUTTON,
            title: 'Save',
            onClick: () => this.save(),
            disabled: false,
          },
          {
            id: '__Delete',
            type: Elements.BUTTON,
            title: 'Delete',
            onClick: () => this.delete(),
            disabled: false,
          },
          {
            id: '__Close',
            type: Elements.BUTTON,
            title: 'Close',
            onClick: () => this.close(),
            disabled: false,
          },
        ];
      }

      if (params.id && params.id !== 'new') {
        this.uuid = params.id;
      }
    }
    afterInit() {
      if (this.uuid) this.load();
    }
    async load() {
      const result = await this.app[name].get({ uuid: this.uuid });
      if (result.response) {
        this.setValues(result.response);
        return result.response;
      }
      return null;
    }
    async save() {
      const data = this.getValues();
      const result = await this.app[name].put({ body: data, uuid: this.uuid });

      if (result.response) {
        this.uuid = result.response.uuid;
        this.app.showAlert({ type: 'success', title: 'Saved!' });
      }
      const url = `${window.location.pathname}?id=${this.uuid}`;
      window.history.replaceState(window.history.state, undefined, url);

      if (result.error) {
        this.app.showAlert({ type: 'warning', title: result.error.message });
      }
    }
    async delete() {
      if (!await this.content.confirmDialog.confirm({ title: 'Are you sure?' })) return;
      const result = await this.app[name].delete({ uuid: this.uuid });
      if (result.response) {
        this.close();
        this.app.showAlert({ type: 'success', title: 'Deleted!' });
      }
      if (result.error) {
        this.app.showAlert({ type: 'warning', title: result.error.message });
      }
    }
    close () {
      if (this.app.formCloseHistoryBack) {
        window.history.back();
      } else {
        this.app.open(`${name}List`, {});
      }
    };
    async ok() {
      await this.save();
      this.close();
    };
  };

export default makeItemForm;
