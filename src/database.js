/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import Sequelize from 'sequelize';
import Fields from './fields';
import { model, modelGetOptions, modelUpdateFields, capitalize, tables } from './Entity';

export const SequelizeFields = {
  [Fields.STRING]: Sequelize.STRING,
  [Fields.INTEGER]: Sequelize.INTEGER,
  [Fields.REFERENCE]: Sequelize.VIRTUAL,
  [Fields.DECIMAL]: Sequelize.DECIMAL,
  [Fields.BOOLEAN]: Sequelize.BOOLEAN,
  [Fields.TEXT]: Sequelize.TEXT,
  [Fields.DATE]: Sequelize.DATE,
  [Fields.DATEONLY]: Sequelize.DATEONLY,
  [Fields.JSON]: Sequelize.JSON,
};

const getModelParams = (entity, structure, rowNumber) => {
  const modelParams = {
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
  };
  if (rowNumber) {
    modelParams.rowNumber = {
      type: Sequelize.INTEGER,
    };
  }
  const modelOptions = {
    indexes: structure.indexes,
    getterMethods: {
    },
    setterMethods: {
    },
  };

  // eslint-disable-next-line no-param-reassign
  entity[modelGetOptions] = { include: [], attributes: ['uuid', 'createdAt', 'updatedAt'] };
  if (rowNumber) {
    entity[modelGetOptions].attributes.push('rowNumber');
  }
  // eslint-disable-next-line no-param-reassign
  entity[modelUpdateFields] = [];

  structure.fields.forEach((field) => {
    switch (field.type) {
      case Fields.REFERENCE:
        entity[modelUpdateFields].push(`${field.name}Uuid`);
        // need include ref field, because with LIMIT condition
        // reference join fails without it
        entity[modelGetOptions].attributes.push(`${field.name}Uuid`);
        modelOptions.setterMethods[field.name] = function setter(value) {
          // if (value && !this.getDataValue(field.name)) {
          if (value) {
            this.setDataValue(`${field.name}Uuid`, value.uuid);
          } else {
            this.setDataValue(`${field.name}Uuid`, null);
          }
        };
        break;
      case Fields.DECIMAL:
        entity[modelUpdateFields].push(field.name);
        entity[modelGetOptions].attributes.push(field.name);
        modelParams[field.name] = {
          type: SequelizeFields[field.type](field.length || 15, field.precision || 2),
        };
        break;
      case Fields.BOOLEAN:
        entity[modelUpdateFields].push(field.name);
        entity[modelGetOptions].attributes.push(field.name);
        modelParams[field.name] = {
          type: SequelizeFields[field.type],
          defaultValue: false,
        };
        break;
      default:
        entity[modelUpdateFields].push(field.name);
        entity[modelGetOptions].attributes.push(field.name);
        modelParams[field.name] = {
          type: SequelizeFields[field.type],
        };
    }
  });
  return { params: modelParams, options: modelOptions };
};

const makeAssociations = (entities, logger, isSqlite = false) => {
  Object.values(entities).forEach((entity) => {
    if (entity.structure && entity.structure.fields) {
      entity.structure.fields.forEach((field, index) => {
        if (field.type === Fields.REFERENCE) {
          entity[model].belongsTo(entities[field.entity][model], { as: field.name, uniqueKey: `ref${index}` });
          entity[modelGetOptions].include.push({ model: entities[field.entity][model], as: field.name, attributes: field.attributes || ['title', 'uuid'] });
          if (logger) logger.info('Defined association:', entity[model].Name, field.name, ' - ', entities[field.entity][model].Name);
        }
      });
    }
    if (entity.structure && entity.structure.tables) {
      entity.structure.tables.forEach((tableStructure, tabindex) => {
        const table = entity[tables][tableStructure.name];
        tableStructure.fields.forEach((field, index) => {
          if (field.type === Fields.REFERENCE) {
            table[model].belongsTo(entities[field.entity][model], { as: field.name, uniqueKey: `tab${tabindex}ref${index}` });
            table[modelGetOptions].include.push({ model: entities[field.entity][model], as: field.name, attributes: field.attributes || ['title', 'uuid'] });
            if (logger) logger.info('Defined association:', table[model].Name, field.name, ' - ', entities[field.entity][model].Name);
          }
        });
        const relationsProps = {};
        if (isSqlite) {
          // sqlite sync do backup and drop and it cause all table data deleted
          // use NO ACTION to prevend data loose on dnsync
          relationsProps.onDelete = 'NO ACTION';
        }
        entity[model].hasMany(table[model], { as: tableStructure.name, uniqueKey: `tab${tabindex}`, ...relationsProps });
        if (logger) logger.info('Defined association:', entity[model].Name, tableStructure.name, ' ->>', table[model].Name);
        entity[modelGetOptions].include.push({
          model: table[model],
          as: tableStructure.name,
          include: table[modelGetOptions].include,
          attributes: table[modelGetOptions].attributes,
        });
      });
    }
  });
};

export default class Database {
  constructor({ databaseParams, entities, logger }) {
    this.logger = logger;
    if (Array.isArray(databaseParams)) {
      this.sequelize = new Sequelize(...databaseParams);
    } else {
      this.sequelize = new Sequelize({
        dialect: 'mysql',
        dialectOptions: { decimalNumbers: true },
        ...databaseParams,
      });
    }
    this.Sequelize = Sequelize;
    this.entities = entities;
    this.isSqlite = databaseParams.dialect === 'sqlite';
    this.createModels();
  }

  async init() {
    try {
      await this.sequelize.authenticate();
      this.logger.info('...connected to database');
    } catch (e) {
      this.logger.error('...can not connect to database!', e);
      process.exit(e);
    }
  }

  createModels() {
    Object.keys(this.entities).forEach((entityName) => {
      const entity = this.entities[entityName];
      if (entity.structure && entity.structure.fields) {
        const { params, options } = getModelParams(entity, entity.structure);
        entity[model] = this.sequelize.define(entityName.toLowerCase(), params, options);
        entity[model].db = this;
        entity[model].Name = entityName;
        this.logger.info('Defined model:', entityName.toLowerCase());
      }
      if (entity.structure && entity.structure.tables) {
        entity[tables] = {};
        entity.structure.tables.forEach((tableStructure) => {
          const table = {};
          entity[tables][tableStructure.name] = table;
          const {
            params: tableParams,
            options: tableOptions,
          } = getModelParams(table, tableStructure, true);
          // eslint-disable-next-line no-param-reassign
          table[model] = this.sequelize.define(`${entityName.toLowerCase()}${capitalize(tableStructure.name)}`, tableParams, tableOptions);
          table[model].Name = `${entityName.toLowerCase()}${capitalize(tableStructure.name)}`;
          this.logger.info('Defined model:', table[model].Name);
        });
      }
    });
    makeAssociations(this.entities, this.logger, this.isSqlite);
  }

  async sync() {
    if (this.isSqlite) {
      await this.sequelize.query('PRAGMA foreign_keys = false;');
    }
    await this.sequelize.sync({ alter: true });
  }
}
