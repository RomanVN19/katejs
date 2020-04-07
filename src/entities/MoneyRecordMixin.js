
export default Entity => class MoneyRecord extends Entity {
  async afterRecordsPut({ records, ctx }) {
    console.log('AFTER PUT', ctx.state.user);
  }
};
