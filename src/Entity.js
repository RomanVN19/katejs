/* eslint-disable no-param-reassign */

/*
Copyright © 2018 Roman Nep <neproman@gmail.com>

This file is part of KateJS.

KateJS is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

KateJS is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with KateJS.  If not, see <https://www.gnu.org/licenses/>.
*/
import Fields from './fields';

export const model = Symbol('model');
export const literal = Symbol('literal');
export const modelGetOptions = Symbol('modelGetOptions');
export const modelUpdateFields = Symbol('modelUpdateFields');
export const tables = Symbol('tables');
export const rawQuery = Symbol('rawQuery');

export const capitalize = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

const noItemErr = { message: 'Can\'t find entity item', status: 404 };

const replaceOps = (obj, S, opt) => {
  if (!obj) return obj;
  let result = Array.isArray(obj) ? [] : {};
  if (obj[literal]) {
    result = S.literal(obj[literal]);
  }
  Object.keys(obj).forEach((key) => {
    if (key.indexOf('.') > -1) {
      opt.subQuery = false;
    }
    if (key === '$func') {
      result = S.fn(obj[key].fn, S.col(obj[key].col));
      return;
    }
    if (key === '$col') {
      result = S.col(obj[key]);
      return;
    }
    let newKey = key;
    if (key[0] === '$') {
      newKey = S.Op[key.substr(1)] || key;
    }
    if (typeof obj[key] === 'object' && obj[key]) {
      result[newKey] = replaceOps(obj[key], S, opt);
    } else {
      result[newKey] = obj[key];
    }
  });
  return result;
};

export default class Entity {
  constructor(params) {
    Object.assign(this, params);
  }
  transaction(options) {
    return this[model].db.sequelize.transaction(options);
  }
  async get({ data, transaction, lock }) {
    const order = [];
    if (this[tables]) {
      Object.keys(this[tables]).forEach(tableName =>
        order.push([{ model: this[tables][tableName][model], as: tableName }, 'rowNumber']));
    }

    const item = await this[model].findByPk(
      data.uuid,
      { ...this[modelGetOptions], order, transaction, lock },
    );
    if (!item) {
      return { error: noItemErr };
    }
    return { response: item.toJSON() };
  }
  async put({ data, ctx, transaction: t }) {
    let transaction;
    if (!data.body) return { error: { message: 'No body!', status: 400 } };
    try {
      transaction = t || await this[model].db.sequelize.transaction();
      let item;
      let savedEntity;
      if (data.uuid) {
        item = await this[model].findByPk(data.uuid, { ...this[modelGetOptions], transaction });
        if (!item) {
          return { error: noItemErr };
        }
        savedEntity = item.toJSON();
        if (ctx) { // can be called from another entity without ctx
          ctx.state.savedEntity = savedEntity;
        }
        if (this.beforePut) {
          // data.body can be changed
          await this.beforePut({ savedEntity, body: data.body, transaction, ctx });
        }
        await item.update(data.body, { fields: this[modelUpdateFields], transaction });
      } else {
        if (this.beforePut) {
          // data.body can be changed
          await this.beforePut({ savedEntity, body: data.body, transaction, ctx });
        }
        item = await this[model].create(data.body, { transaction });
      }

      if (this[tables]) {
        await Promise.all(Object.keys(this[tables]).map(async (tableName) => {
          const table = this[tables][tableName];
          if (data.body[tableName]) { // replace table only if it specified
            if (data.uuid) {
              await table[model].destroy({
                where: { [`${this[model].Name}Uuid`]: item.uuid },
                transaction,
              });
            }
            const tableData = data.body[tableName]
              .map((row, index) => ({ ...row, rowNumber: index + 1 }));
            const rows = await table[model].bulkCreate(tableData, { transaction });
            await item[`set${capitalize(tableName)}`](rows, { transaction });
          }
        }));
      }
      if (this.afterPut) {
        await this.afterPut({
          entity: Object.assign({ uuid: item.uuid }, savedEntity, data.body),
          transaction,
          ctx,
        });
      }
      if (!t) {
        await transaction.commit();
      }
      return { response: item.toJSON() };
    } catch (error) {
      this.logger.error(error);
      if (transaction && !t) {
        await transaction.rollback();
      }
      return { error };
    }
  }
  async delete({ data, transaction: t }) {
    let transaction;
    try {
      transaction = t || await this[model].db.sequelize.transaction();
      const item = await this[model].findByPk(data.uuid, { ...this[modelGetOptions], transaction });
      if (!item) {
        return { error: noItemErr };
      }
      await item.destroy({ transaction });
      if (!t) {
        await transaction.commit();
      }
      return { response: { ok: true } };
    } catch (error) {
      this.logger.error(error);
      if (transaction) {
        await transaction.rollback();
      }
      return { error };
    }
  }

  async [rawQuery]({ query }) {
    try {
      const [results, metadata] = await this[model].db.sequelize.query(query);
      return {
        response: {
          results,
          metadata,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return { error };
    }
  }

  async query({ data = {}, transaction, lock } = { data: {} }) {
    const queryOptions = {};
    if (data && (data.where || data.attributes || data.group || data.order)) {
      data.where = replaceOps(data.where, this[model].db.Sequelize, queryOptions);
      data.attributes = replaceOps(data.attributes, this[model].db.Sequelize, queryOptions);
      data.group = replaceOps(data.group, this[model].db.Sequelize, queryOptions);
      data.order = replaceOps(data.order, this[model].db.Sequelize, queryOptions);
      if (data.subQuery === undefined) {
        data.subQuery = queryOptions.subQuery;
      }
    }
    if (this.app.paginationLimit) {
      const { page = 1 } = data || {};
      data.offset = (page - 1) * (data.limit || this.app.paginationLimit);
      if (queryOptions.subQuery === false) {
        // when condition to joined tables present limit works weird
        data.limit = data.limit === -1 ? undefined : data.limit;
      } else {
        data.limit = data.limit === -1 ? undefined : (data.limit || this.app.paginationLimit);
      }
    }
    const order = data.order || [];
    if (!order.length) {
      const orderField = this.structure.fields.find(item => item.type !== Fields.REFERENCE);
      if (orderField) {
        order.push(orderField.name);
      }
    }
    if (this[tables] && !data.noOptions) {
      Object.keys(this[tables]).forEach(tableName =>
        order.push([{ model: this[tables][tableName][model], as: tableName }, 'rowNumber']));
    }
    const options = data.noOptions ? {} : { ...this[modelGetOptions], order };
    if (!data.order) delete data.order; // to avoid replace in spread below
    const result = await this[model].findAll({
      ...options,
      ...data,
      transaction,
      lock,
    });
    return { response: data.raw ? result : result.map(item => item.toJSON()) };
  }
}
