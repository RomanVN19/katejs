import Fields from 'katejs/lib/fields';
import { structures } from '../structure';

const RecordMixin = Entity => class RecordEntity extends Entity {
  constructor(params) {
    super(params);
    this.recordParams = {
      fields: [...this.structure.fields],
      resources: this.structure.resources,
    };
    this.structure.fields = this.structure.fields || [];
    this.structure.fields.unshift(...structures.Record.fields);
    this.structure.fields.push(...this.structure.resources);
  }
  async put(params) {
    return super.put(params);
  }
  async balance({ data: { date, where: whereParams }, ctx }) {
    const where = {};
    if (date) {
      where.date = { $lte: date };
    }
    const attributes = [];
    this.recordParams.resources.forEach((resource) => {
      attributes.push([{ $func: { fn: 'SUM', col: resource.name } }, resource.name]);
    });
    const group = [];
    this.recordParams.fields.forEach((field) => {
      if (field.type === Fields.REFERENCE) {
        group.push(`${field.name}Uuid`);
      } else {
        group.push(field.name);
      }
    });
    return this.query({
      data: {
        where: Object.assign(where, whereParams),
        attributes,
        group,
        limit: -1,
      },
      ctx,
    });
  }
  async turnover(params) {
    const data = params.data || {};
    data.limit = -1;
    return this.query({ ...params, data });
  }
};

export default RecordMixin;
