import { Elements, Form, getElement } from 'katejs/lib/client';
import Fields from '../katejs/fields';

export default class TestForm extends Form {
  constructor(args) {
    super(args);
    this.elements = [
      {
        type: Elements.GROUP,
        div: true,
        elements: [
          {
            type: Elements.LABEL,
            title: 'Test form',
          },
        ],
      },
      {
        type: Elements.TABLE,
        style: { maxHeight: 200, overflowY: 'scroll' },
        columns: [
          {
            title: 'Test',
            dataPath: 'test',
          },
        ],
        value: [
          { test: 123 },
          { test: 123 },
          { test: 123 },
          { test: 123 },
          { test: 123 },
          { test: 123 },
          { test: 123 },
        ],
      },
      {
        type: Elements.GRID,
        elements: [
          {
            id: 'select',
            type: Elements.SELECT,
            selectValue: true,
            options: [],
            value: 2,
          },
          {
            type: Elements.BUTTON,
            title: 'set 3',
            onClick: () => this.content.select.value = 3,
          },
        ],
      },
      {
        type: Elements.GRID,
        elements: [
          {
            id: 'selectReadonly',
            type: Elements.SELECT,
            selectValue: true,
            inputReadonly: true,
            openOnFocus: true,
            options: [
              {
                title: '1mm',
                value: 1,
              },
              {
                title: '2mm',
                value: 1,
              },
              {
                title: '2mm',
                value: 1,
              },
            ],
            value: 2,
          },
          {
            type: Elements.BUTTON,
            title: 'Open modal',
            onClick: () => this.content.modal.open = true,
          },
          {
            type: Elements.MODAL,
            open: false,
            id: 'modal',
            handleClose: () => 0,
            elements: [
              {
                type: Elements.BUTTON,
                title: 'Close',
                onClick: () => this.content.modal.open = false,
              },
            ],
          },
        ],
      },
      getElement({
        type: Fields.REFERENCE,
        name: 'income',
        entity: 'Income',
      }, this),
      {
        type: Elements.BUTTON,
        title: 'resave doc',
        onClick: () => this.resave(),
      },
    ];

    console.log('app form constr', !!this.app.authorization, this.app.allow('Expense', 'put'));
  }
  afterInit() {
    this.content.select.options = [
      { title: 'v1', value: 1 },
      { title: 'v2', value: 2 },
      { title: 'v3', value: 3 },
    ];
  }
  async resave() {
    const uuid = this.content.income.value.uuid;
    console.log('uuid', uuid);
    const { response: income } = await this.app.Income.get({ uuid });
    await this.app.Income.put({ uuid, body: { sum: income.sum + 123 } });
  }
}