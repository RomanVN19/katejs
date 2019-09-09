import { Elements } from 'kate-form-material-kit-react';
import Form from './Form';
import { ConfirmDialog } from './Dialogs';
import { getElement, getTableElement, makeTitle } from '../client';

const ok = Symbol('ok');
const load = Symbol('load');
const save = Symbol('save');
const del = Symbol('delete');
const close = Symbol('close');

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
            onClick: this[ok],
            disabled: false,
          },
          {
            id: '__Save',
            type: Elements.BUTTON,
            title: 'Save',
            onClick: this[save],
            disabled: false,
          },
          // {
          //   id: '__Load',
          //   type: Elements.BUTTON,
          //   title: 'Load',
          //   onClick: this.load,
          // },
          {
            id: '__Delete',
            type: Elements.BUTTON,
            title: 'Delete',
            onClick: this[del],
            disabled: false,
          },
          {
            id: '__Close',
            type: Elements.BUTTON,
            title: 'Close',
            onClick: this[close],
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
      if (result.error) {
        this.app.showAlert({ type: 'warning', title: result.error.message });
      }
    }
    async delete() {
      if (!await this.content.confirmDialog.confirm({ title: 'Are you sure?' })) return;
      const result = await this.app[name].delete({ uuid: this.uuid });
      if (result.response) {
        this[close]();
        this.app.showAlert({ type: 'success', title: 'Deleted!' });
      }
      if (result.error) {
        this.app.showAlert({ type: 'warning', title: result.error.message });
      }
    }
    [close] = () => {
      this.app.open(`${name}List`);
    }
    [ok] = async () => {
      await this.save();
      this[close]();
    }
    [load] = () => this.load();
    [save] = () => this.save();
    [del] = () => this.delete();
  };

export default makeItemForm;
