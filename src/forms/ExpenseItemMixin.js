import { Elements } from 'katejs/lib/client';

export default ItemForm => class ExpenseItem extends ItemForm {
  static doc = true;

  constructor(args) {
    super(args);
    this.elements.get('total').disabled = true;
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
  }

  calcTotal() {
    const expenses = this.content.expensesDetails.value;
    this.content.total.value = expenses.reduce((acc, val) => acc + (+val.sum), 0);
  }
};
