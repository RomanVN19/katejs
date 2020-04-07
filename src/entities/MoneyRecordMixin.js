
export default Entity => class MoneyRecord extends Entity {
  async afterRecordsPut({ records }) {
    console.log('AFTER PUT', records);
  }
};
