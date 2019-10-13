/* eslint-disable no-await-in-loop */
import fs from 'fs';

const readFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf-8', (err, buffer) => {
    if (err) reject(err); else resolve(buffer);
  });
});

// eslint-disable-next-line arrow-body-style
const getDataArray = (rowString) => {
  return rowString.split(',').map(elem => elem.replace(/"/g, '').trim());
};

export default class Import {
  constructor(args) {
    Object.assign(this, args);
  }
  async import({ ctx, data }) {
    const { entity, syncField = 'title' } = data;
    this.logger.info('do import', entity, 'by', syncField);
    if (!this.app[entity] || !this.app[entity].put || !this.app[entity].get) {
      return { error: { status: 400, message: 'No entity' } };
    }
    const { file } = ctx.request.files;
    let fileData;
    try {
      fileData = await readFile(file.path);
    } catch (error) {
      return { error };
    }
    const [fieldsRow, ...rows] = fileData.split(/\r?\n/);
    const fields = getDataArray(fieldsRow);
    const linkFields = fields.filter(field => field.indexOf('$') > -1);
    this.logger.debug('importing fields', fields);

    const transaction = await this.app[entity].transaction();
    let createdCount = 0;
    const messages = [];
    try {
      for (let index = 0; index < rows.length; index += 1) {
        const entityData = getDataArray(rows[index])
          .reduce((acc, val, i) => ({ ...acc, [fields[i]]: val }), {});

        // process concat field +addstr+addfield
        fields.filter(f => f[0] === '+').forEach((f) => {
          const [, addString, fieldForConcat] = f.split('+');
          if (entityData[f]) {
            entityData[fieldForConcat] = `${entityData[fieldForConcat]}${addString}${entityData[f]}`;
          }
        });
        if (!entityData[syncField]) {
          messages.push(`Empty sync field ${syncField} for row ${index}`);
          this.logger.info('Empty sync field ', syncField, ' for ', entityData);
          // eslint-disable-next-line no-continue
          continue;
        }
        await Promise.all(linkFields.map(async (field) => {
          const [linkField, linkEntity, linkSync] = field.split('$');
          const { response: linkItems } = await this.app[linkEntity].query({
            data: { where: { [linkSync]: entityData[field] } },
            transaction,
            ctx,
          });
          if (!linkItems || !linkItems.length) {
            messages.push(`Cannot find ${linkField} by ${linkSync} = ${entityData[field]}`);
            return;
          }
          if (linkItems.length > 1) {
            messages.push(`More than one ${linkField} found by ${linkSync} = ${entityData[field]}`);
            return;
          }
          entityData[linkField] = { title: linkItems[0].title, uuid: linkItems[0].uuid };
        }));

        const { response: existingEntitties } = await this.app[entity]
          .query({ data: { where: { [syncField]: entityData[syncField] } }, transaction, ctx });
        if (existingEntitties && existingEntitties.length) {
          this.logger.info('Entities for', syncField, '=', entityData[syncField], ' exitst!');
          // eslint-disable-next-line no-continue
          continue;
        }
        const { response: putResult } =
          await this.app[entity].put({ data: { body: entityData }, transaction, ctx });
        if (putResult) createdCount += 1;
      }

      await transaction.commit();
      return { response: { message: messages.join('\n'), createdCount } };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      return { error };
    }
  }
}
