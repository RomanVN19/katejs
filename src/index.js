/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import Server, { terms } from './KateServer';
import { apiUrl } from './http';
import Fields from './fields';
import { makeEntitiesFromStructures, trivialLogger } from './server';
import Entity from './Entity';
import { literal, model, modelGetOptions, modelUpdateFields, tables, capitalize } from './Entity';

const use = (parent, ...classes) => {
  let result = parent;
  result.packages = result.packages || [];
  (classes || []).forEach((Package) => {
    if (result.packages.indexOf(Package.package) === -1) {
      result.packages.push(Package.package);
      result = Package(result);
    }
  });
  return result;
};

class ApiError extends Error {
  constructor({ message, status = 400 }) {
    super();
    this.status = status;
    this.message = message;
  }
}

export {
  Fields,
  Entity,
  makeEntitiesFromStructures,
  use,
  ApiError,
  Server,
  apiUrl,
  literal,
  model,
  modelGetOptions,
  modelUpdateFields,
  tables,
  terms,
  capitalize,
};
