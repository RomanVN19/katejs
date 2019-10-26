/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/
import KateClient from './kate-client';
import { Elements } from './kate-form-material-kit-react';
import Form from './forms/Form';
import App from './forms/App';
import { ConfirmDialog } from './forms/Dialogs';
import makeItemForm from './forms/Item';
import makeListForm from './forms/List';
import translations from './translations';
import { capitalize, makeTitle, makeTitlePlural, getElement, getTableElement, decimalFormat } from './shared';


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
  getElement, getTableElement, decimalFormat,
};


export default KateJSClient;
