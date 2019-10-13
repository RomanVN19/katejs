// import Fields from 'katejs/lib/fields';
import { Elements, getElement } from 'katejs/lib/client';

import { structures } from '../structure';

const { Doc: { fields } } = structures;

const DocForm = ItemForm => class DocItem extends ItemForm {
  constructor(params) {
    super(params);

    this.elements.unshift({
      type: Elements.GRID,
      elements: [
        getElement(fields[0], this),
        getElement(fields[1], this),
      ],
    });
    if (!this.uuid) {
      this.elements.get('date').value = new Date();
    }
  }
};

export default DocForm;
