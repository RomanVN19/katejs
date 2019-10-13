
export default Entity => class Income extends Entity {
  static doc = true;

  static records = ['MoneyRecord'];

  // eslint-disable-next-line class-methods-use-this
  makeRecords(doc) {
    return {
      MoneyRecord: [{
        wallet: doc.wallet,
        sum: doc.sum,
      }],
    };
  }
};
