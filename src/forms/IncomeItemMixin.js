import { Elements } from 'katejs/lib/client';

export default ItemForm => class IncomeItem extends ItemForm {
  static doc = true;

  constructor(args) {
    super(args);
    this.elements.splice(0, 2, {
      type: Elements.GRID,
      elements: [
        { ...this.elements.get('wallet'), cols: 6 },
        { ...this.elements.get('article'), cols: 6 },
      ],
    });
  }
};
