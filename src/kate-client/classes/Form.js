const setData = Symbol('setData');
const getData = Symbol('getData');
const elements = Symbol('elements');

export const get = (array, id) => {
  for (let index = 0; index < array.length; index += 1) {
    if (array[index].id === id) return array[index];
    if (array[index].elements) {
      const el = get(array[index].elements, id);
      if (el) return el;
    }
  }
  return null;
};

export const set = (array, id, value) => {
  for (let index = 0; index < array.length; index += 1) {
    if (array[index].id === id) {
      // eslint-disable-next-line no-param-reassign
      array[index] = value;
      return;
    }
    if (array[index].elements) {
      set(array[index].elements, id, value);
    }
  }
};

export default class Form {
  constructor({ sys: params }) {
    this[setData] = params.setData;
    this[getData] = params.getData;
    this.getValues = params.getValues;
    this.setValues = params.setValues;
    this.app = params.app;
    this.content = params.kateFormContent;
  }
  set elements(value) {
    // eslint-disable-next-line no-param-reassign
    value.get = id => get(value, id);
    // eslint-disable-next-line no-param-reassign
    value.set = (id, item) => set(value, id, item);
    this[elements] = value;
  }
  get elements() {
    return this[elements];
  }
  init(content) {
    this[setData]('', content || this.elements);
    if (this.afterInit) {
      setTimeout(() => this.afterInit(), 0);
    }
  }
}
