
export default Entity => class Expense extends Entity {
  static doc = true;

  static records = ['MoneyRecord'];

  beforePut({ savedEntity, body, transaction, ctx }) {
    if (super.beforePut) super.beforePut({ savedEntity, body, transaction, ctx });
    if (body && body.expensesDetails && body.expensesDetails.length) {
      // eslint-disable-next-line no-param-reassign
      body.total = body.expensesDetails.reduce((acc, val) => acc + (+val.sum), 0);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  makeRecords(doc) {
    return {
      MoneyRecord: [{
        wallet: doc.wallet,
        sum: -doc.total,
      }],
    };
  }
};
