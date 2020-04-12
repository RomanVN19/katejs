import { Elements, Form } from 'katejs/lib/client';

export default class TestForm extends Form {
  constructor(args) {
    super(args);
    this.elements = [
      {
        type: Elements.LABEL,
        title: 'Test form',
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
    ];
  }
}
