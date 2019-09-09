import { Elements } from 'kate-form-material-kit-react';
import Form from './Form';
import { makeTitle, makeTitlePlural } from '../client';
import Fields from '../fields';

const add = Symbol('add');
const open = Symbol('open');
const pageChange = Symbol('loadPage');

const notNullString = val => ((val === null || val === undefined) ? '' : `${val}`);

const fieldForList = (field) => {
  if (field.skipForList) return false;
  if (field.type === Fields.JSON) return false;
  return true;
};

const makeListForm = ({ structure, name, addActions = true, addElements = true }) =>
  class ListForm extends Form {
    static title = makeTitlePlural(name)
    static structure = structure;
    static entity = name;

    constructor(args) {
      super(args);

      this.entity = name;
      if (addActions) {
        this.actions = [
          {
            id: '__Add',
            type: Elements.BUTTON,
            title: 'Add',
            onClick: this[add],
          },
        ];
      }

      if (addElements) {
        this.elements = [
          {
            id: 'list',
            type: Elements.TABLE,
            rowClick: this[open],
            columns: structure.fields ?
              structure.fields.filter(item => fieldForList(item)).map(item => ({
                title: makeTitle(item.name),
                dataPath: item.name,
                format: value => (typeof value === 'object' && value ? value.title : notNullString(value)),
              }))
              : [],
            value: [],
          },
          {
            id: 'pagination',
            type: Elements.PAGINATION,
            hidden: true,
            pageChange: this[pageChange],
            max: 0,
          },
        ];
      }
      setTimeout(() => this.load(), 0); // to process filter from childs
    }
    async load({ page = 1, limit } = {}) {
      const result = await this.app[name]
        .query({ where: this.filters, order: this.order, page, limit });
      this.content.list.value = result.response;
      if (this.app.paginationLimit && result.response) {
        this.content.pagination.page = page;
        if (this.app.paginationLimit <= result.response.length) {
          if (this.content.pagination.hidden) {
            this.content.pagination.hidden = false;
          }
          this.content.pagination.max = 0;
        } else {
          this.content.pagination.max = page;
        }
      }
      if (result.error) {
        this.app.showAlert({ type: 'warning', title: result.error.message });
        return null;
      }
      return result.response;
    }
    [pageChange] = (page) => {
      this.load({ page });
    }
    [add] = () => {
      this.app.open(`${name}Item`, { id: 'new' });
    }
    [open] = (row) => {
      this.app.open(`${name}Item`, { id: row.uuid });
    }
  };

export default makeListForm;
