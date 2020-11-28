import { Elements } from 'katejs/lib/client';
import { AppFiles } from 'katejs-modules/lib/client';

export default ItemForm => class ExpenseItem extends ItemForm {
  static doc = true;

  constructor(args) {
    super(args);
    this.elements.get('total').disabled = true;

    this.elements.unshift({
      type: Elements.GRID,
      elements: [
        { ...this.elements.cut('image2'), cols: 8 },
        { ...AppFiles.getImageElement('image2', this), cols:  4},
      ],
    });

    this.elements.unshift({
      type: Elements.GRID,
      elements: [
        { ...this.elements.cut('image1'), cols: 8, onChange: (val) => this.image1Change(val) },
        { ...AppFiles.getImageElement('image1', this), cols:  4},
      ],
    });

    this.elements.unshift({
      type: Elements.GRID,
      elements: [
        this.elements.cut('wallet'),
        this.elements.cut('total',)
      ],
    });
    const table = this.elements.get('expensesDetails');
    const sumCol = table.columns.find(col => col.id === 'sum');
    sumCol.onChange = () => this.calcTotal();
    table.onDelete = () => this.calcTotal();
    console.log('mixin constr');
    const imagesTable = this.elements.get('images');
    imagesTable.columns.push({
      ...AppFiles.getImageTableElement('image', 'images', this),
      width: `15%`,
    });
  }

  calcTotal() {
    const expenses = this.content.expensesDetails.value;
    this.content.total.value = expenses.reduce((acc, val) => acc + (+val.sum), 0);
  }

  image1Change(val) {
    console.log('image1 change', val);
  }
};
