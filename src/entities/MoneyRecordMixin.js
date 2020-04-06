
export default Entity => class MoneyRecord extends Entity {
  async beforeRecordsPut({ records }) {
    console.log('BEFORE PUT', records);
  }
};
