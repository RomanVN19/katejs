/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/
import KateClient from 'kate-client';
import { Elements } from 'kate-form-material-kit-react';
import Form from './forms/Form';
import App from './forms/App';
import { ConfirmDialog } from './forms/Dialogs';
import makeItemForm from './forms/Item';
import makeListForm from './forms/List';
import translations from './translations';
import { capitalize, makeTitle, makeTitlePlural, getElement, getTableElement } from './forms/shared';

export const decimalFormat = (length, precision) => {
  const intLength = (length || 15) - (precision || 2);
  const re = precision === 0 ? new RegExp(`\\d{0,${length || 15}}`)
    : new RegExp(`\\d{0,${intLength}}(\\.\\d{0,${precision || 2}})?`);
  return (val) => {
    const res = re.exec(val);
    // numbers formated as string to allow enter partial decimal (like "10." -> "10.5")
    return res ? res[0] : 0;
  };
};


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

const KateJSClient = ({ AppClient, translations: userTranslations }) => {
  KateClient({ app: AppClient(App), translations: userTranslations });
};

const ItemForm = (entity, { addActions = false, addElements = false } = {}) => {
  const name = Object.keys(entity)[0];
  return makeItemForm({ structure: entity[name], name, addActions, addElements });
};

const ListForm = (entity, { addActions = false, addElements = false } = {}) => {
  const name = Object.keys(entity)[0];
  return makeListForm({ structure: entity[name], name, addActions, addElements });
};


export {
  App,
  Form,
  Elements,
  makeItemForm,
  makeListForm,
  ItemForm,
  ListForm,
  use,
  ConfirmDialog,
  translations,
  capitalize, makeTitle, makeTitlePlural,
  getElement, getTableElement,
};


export default KateJSClient;
