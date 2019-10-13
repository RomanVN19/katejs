
export default ItemForm => class ExpenseItem extends ItemForm {
  static doc = true;

  constructor(args) {
    super(args);

    this.elements.get('total').disabled = true;
    const table = this.elements.get('expensesDetails');
    const sumCol = table.columns.find(col => col.id === 'sum');
    sumCol.onChange = () => this.calcTotal();
    table.onDelete = () => this.calcTotal();
  }

  calcTotal() {
    const expenses = this.content.expensesDetails.value;
    this.content.total.value = expenses.reduce((acc, val) => acc + (+val.sum), 0);
  }
};
