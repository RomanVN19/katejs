
export default (Entity, params = {}) => class Settings extends Entity {
  constructor(args) {
    super(args);
    this.structure.fields = [...this.structure.fields, ...(params.fields || [])];
  }
  async set({ ctx, data }) {
    let uuid;
    const { response: existingSettings } = await this.query({ ctx, data: { limit: 1, order: [['date', 'DESC']] } });
    if (existingSettings && existingSettings[0]) {
      // eslint-disable-next-line prefer-destructuring
      uuid = existingSettings[0].uuid;
    }
    return this.put({
      ctx,
      data: {
        uuid,
        body: data,
      },
    });
  }
  async get({ ctx }) {
    const { response: existingSettings } = await this.query({ ctx, data: { limit: 1, order: [['date', 'DESC']] } });
    if (existingSettings && existingSettings[0]) {
      return { response: existingSettings[0] };
    }
    return { response: {} };
  }
};
