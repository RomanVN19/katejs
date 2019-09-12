/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/
import Entity from './Entity';
import KateServer from './KateServer';

export const makeEntityFromStructure = structure =>
  class EntityFromStructure extends Entity {
    static structure = structure;
    constructor(params) {
      super(params);
      this.structure = structure;
    }
  };

export const makeEntitiesFromStructures = (entities, structures) => {
  Object.keys(structures).forEach((name) => {
    // eslint-disable-next-line no-param-reassign
    entities[name] = makeEntityFromStructure(structures[name]);
  });
  return entities;
};

export const trivialLogger = {
  info: (...args) => console.log(...args), // eslint-disable-line no-console
  debug: (...args) => console.log(...args), // eslint-disable-line no-console
  error: (...args) => console.error(...args), // eslint-disable-line no-console
};

export default KateServer;
