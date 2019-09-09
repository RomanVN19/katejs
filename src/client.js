
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
import KateClient from 'kate-client';
import { Elements } from 'kate-form-material-kit-react';
import Form from './forms/Form';
import App from './forms/App';
import Fields from './fields';
import { ConfirmDialog } from './forms/Dialogs';
import makeItemForm from './forms/Item';
import makeListForm from './forms/List';
import translations from './translations';

export const capitalize = string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;

export const makeTitle = string => capitalize(string.replace(/([a-z0-9])([A-Z])/g, '$1 $2'));
export const makeTitlePlural = string => `${makeTitle(string)}s`;

const elementsByFields = {
  [Fields.STRING]: Elements.INPUT,
  [Fields.REFERENCE]: Elements.SELECT,
  [Fields.DECIMAL]: Elements.INPUT,
  [Fields.INTEGER]: Elements.INPUT,
  [Fields.BOOLEAN]: Elements.CHECKBOX,
  [Fields.TEXT]: Elements.INPUT,
  [Fields.DATE]: Elements.DATE,
  [Fields.DATEONLY]: Elements.DATE,
};

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

export const getElement = (field, form) => {
  const element = {
    id: field.name,
    title: makeTitle(field.name),
    type: elementsByFields[field.type],
  };
  if (field.type === Fields.REFERENCE) {
    const getFuncName = `getOptions${capitalize(field.entity)}`;
    if (!form) {
      // eslint-disable-next-line no-console
      console.error('getElement(field, form) - missing form for field', field);
    }
    if (form && !form[getFuncName]) {
      // eslint-disable-next-line no-param-reassign
      form[getFuncName] = async (query) => {
        const where = query && { title: { $like: `%${query}%` } };
        const { response } = await form.app[field.entity].query({ where });
        return response;
      };
    }
    element.getOptions = form && form[getFuncName];
  }
  if (field.type === Fields.DECIMAL) {
    element.format = decimalFormat(field.length, field.precision);
  }
  if (field.type === Fields.INTEGER) {
    element.format = decimalFormat(field.length, 0);
  }
  if (field.type === Fields.TEXT) {
    element.rows = field.rows || 5;
  }
  if (field.type === Fields.DATE) {
    element.dateFormat = 'DD.MM.YYYY';
    element.timeFormat = 'HH:mm';
    element.closeOnSelect = true;
  }
  if (field.type === Fields.DATEONLY) {
    element.dateFormat = 'DD.MM.YYYY';
    element.timeFormat = false;
    element.closeOnSelect = true;
  }
  return element;
};

export const getTableElement = (table, form) => {
  const tableElement = {
    type: Elements.TABLE_EDITABLE,
    id: table.name,
    columns: [
      {
        dataPath: 'rowNumber',
        title: '№',
      },
    ],
  };
  table.fields.filter(field => !field.skipForForm)
    .forEach((field) => {
      const element = getElement(field, form);
      element.dataPath = element.id;
      // columnt id doesnot affect to content, because it in 'columns' not in 'elements'
      tableElement.columns.push(element);
    });
  const addButton = {
    id: `${table.name}AddButton`,
    type: Elements.BUTTON,
    title: 'Add',
    onClick: () => form.content[table.name].addRow({}),
  };

  const cardElement = {
    id: `${table.name}Card`,
    type: Elements.CARD,
    title: makeTitle(table.name),
    titleTag: 'h3',
    elements: [
      {
        id: `${table.name}CardActions`,
        type: Elements.CARD_ACTIONS,
        elements: [
          addButton,
        ],
      },
      tableElement,
    ],
  };

  return cardElement;
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
};


export default KateJSClient;
