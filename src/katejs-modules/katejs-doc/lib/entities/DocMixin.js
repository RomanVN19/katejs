import moment from 'moment';
import { model } from 'katejs';
import { structures } from '../structure';

const DocMixin = Entity => class DocEntity extends Entity {
  constructor(params) {
    super(params);
    this.structure.fields = this.structure.fields || [];
    this.structure.fields.unshift(...structures.Doc.fields);
  }
  async beforePut({ savedEntity, body, transaction, ctx }) {
    if (super.beforePut) await super.beforePut({ savedEntity, body, transaction, ctx });

    if (!body.number && (!savedEntity || !savedEntity.number)) {
      const { response: max } = await this.query({
        ctx,
        data: {
          noOptions: true,
          attributes: [
            [{ $func: { fn: 'MAX', col: 'number' } }, 'maxnumber'],
          ],
          limit: -1,
        },
        transaction, // to find max in bulk create
      });
      const maxNumber = (max[0] && +max[0].maxnumber) || 0;
      // eslint-disable-next-line no-param-reassign
      body.number = maxNumber + 1;
    }

    const date = body.date || (savedEntity && savedEntity.date) || new Date();
    const number = body.number || savedEntity.number;
    // eslint-disable-next-line no-param-reassign
    body.title = this.app.t`${this.app.t(this.constructor.docName)} №${number} from ${moment(date).format('DD.MM.YYYY HH:mm')}`;
  }
  async afterPut({ entity: doc, transaction, ctx }) {
    if (super.afterPut) {
      await super.afterPut({ entity: doc, transaction, ctx });
    }
    if (this.makeRecords && this.constructor.records) {
      const recordsRegs = this.constructor.records;
      const clearPromises = [];
      recordsRegs.forEach(recordsReg => clearPromises
        .push(this.app[recordsReg][model].destroy({
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
        promises.push(this.app[recordEntity].recordsPut({ records, transaction, ctx }));
      });
      await Promise.all(promises);
    }
  }
  async delete({ data, transaction: t }) {
    if (this.makeRecords && this.constructor.records) {
      const recordsRegs = this.constructor.records;
      const clearPromises = [];
      recordsRegs.forEach(recordsReg => clearPromises
        .push(this.app[recordsReg][model].destroy({
          where: { docUuid: data.uuid },
          transaction: t,
        })));
      await Promise.all(clearPromises);
    }
    return super.delete({ data, transaction: t });
  }
};

export default DocMixin;
