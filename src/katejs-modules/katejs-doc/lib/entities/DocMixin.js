import moment from 'moment';
import { model } from 'katejs';
import { structures } from '../structure';

const DocMixin = Entity => class DocEntity extends Entity {
  constructor(params) {
    super(params);
    this.structure.fields = this.structure.fields || [];
    this.structure.fields.unshift(...structures.Doc.fields);
  }
  async put(params) {
    // TODO - own transaction;
    const { date } = params.data.body;
    if (!params.data.body.number) {
      const { response: max } = await this.query({
        ctx: params.ctx,
        data: {
          noOptions: true,
          attributes: [
            [{ $func: { fn: 'MAX', col: 'number' } }, 'maxnumber'],
          ],
          limit: -1,
        },
        transaction: params.transaction, // to find max in bulk create
      });
      const maxNumber = (max[0] && +max[0].maxnumber) || 0;
      // eslint-disable-next-line no-param-reassign
      params.data.body.number = maxNumber + 1;
    }
    // date can be missed. title set moved to beforePut
    // const { number } = params.data.body;
    // // eslint-disable-next-line no-param-reassign
    // params.data.body.title = this.app.t`${this.app.t(this.constructor.docName)} №${number} from ${moment(date).format('DD.MM.YYYY HH:mm')}`;
    return super.put(params);
  }
  async beforePut({ savedEntity, body, transaction, ctx }) {
    if (super.beforePut) await super.beforePut({ savedEntity, body, transaction, ctx });
    const date = body.date || savedEntity.date;
    const number = body.number || savedEntity.number;
    // eslint-disable-next-line no-param-reassign
    body.title = this.app.t`${this.app.t(this.constructor.docName)} №${number} from ${moment(date).format('DD.MM.YYYY HH:mm')}`;
  }
  async afterPut({ entity: doc, transaction, ctx }) {
    if (super.afterPut) {
      await super.afterPut(doc, transaction);
    }
    if (this.makeRecords && this.constructor.records) {
      const recordsRegs = this.constructor.records;
      const clearPromises = [];
      recordsRegs.forEach(recordsReg =>
        clearPromises.push(this.app[recordsReg][model].destroy({
          where: { docUuid: doc.uuid },
          transaction,
        })));
      await Promise.all(clearPromises);
      const allRecords = await this.makeRecords(doc, transaction, ctx);
      const promises = [];
      Object.keys(allRecords).forEach((recordEntity) => {
        const records = allRecords[recordEntity].map(record => ({
          date: doc.date,
          entity: this.constructor.docName,
          docUuid: doc.uuid,
          docTitle: doc.title,
          ...record,
        }));
        // need to use put to process hooks like serviceAccount
        // promises.push(this.app[recordEntity][model].bulkCreate(records, { transaction }));
        records.forEach(record => promises.push(this.app[recordEntity]
          .put({ data: { body: record }, transaction, ctx })));
      });
      await Promise.all(promises);
    }
  }
  async delete({ data, transaction: t }) {
    if (this.makeRecords && this.constructor.records) {
      const recordsRegs = this.constructor.records;
      const clearPromises = [];
      recordsRegs.forEach(recordsReg =>
        clearPromises.push(this.app[recordsReg][model].destroy({
          where: { docUuid: data.uuid },
          transaction: t,
        })));
      await Promise.all(clearPromises);
    }
    return super.delete({ data, transaction: t });
  }
};

export default DocMixin;
