import ProxyPolyfill from 'proxy-polyfill/src/proxy';
import KateForm, { getIn } from './KateForm';
import { components, Elements } from './components';
import { reducer } from './reducer';
import { getSetData } from './actions';
import { KateFormProvider } from './context';
import withKateForm from './withKateForm';

const ProxyP = ProxyPolyfill();

const createElement = (getContent, path, setFormData, prefix = '', obj = {}) => {
  const proxyHandlers = {
    get(target, prop) {
      return getIn(getContent(), path)[prop];
    },
    set(target, prop, value) {
      setFormData(`${prefix}${prefix ? '.' : ''}${path ? `${path}.` : ''}${prop}`, value);
      return true;
    },
  };
  if (window.Proxy) {
    return new Proxy({}, proxyHandlers);
  }
  return new ProxyP(obj, proxyHandlers);
};

const findPath = (data, id, sub) => {
  if (!data || data.id === id) return '';
  if (data[sub]) {
    const subPath = findPath(data[sub], id, sub);
    if (subPath) return `${sub}.${subPath}`;
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === id) {
      return `${i}`;
    } else if (data[i][sub]) {
      const subPath = findPath(data[i][sub], id, sub);
      if (subPath) return `${i}.${sub}.${subPath}`;
    }
  }
  return undefined;
};

const createContent = (getFormData, setFormData, sub = 'elements', prefix = '', obj = {}) => {
  const getContent = () => (prefix ? getIn(getFormData(), prefix) : getFormData());
  const elementsProxies = {};
  const proxyHandlers = {
    get(target, prop) {
      const content = getContent();
      const path = findPath(content, prop, sub);

      if (path !== undefined) {
        if (!elementsProxies[path]) {
          if (window.Proxy) {
            elementsProxies[path] = createElement(getContent, path, setFormData, prefix);
          } else {
            elementsProxies[path] = createElement(getContent, path, setFormData, prefix, obj[prop]);
          }
        }
        return elementsProxies[path];
      }

      return undefined;
    },
    set() {
      return true;
    },
  };
  if (window.Proxy) {
    return new Proxy({}, proxyHandlers);
  }
  return new ProxyP(obj, proxyHandlers);
};

const getValues = (data, sub = 'elements', result = {}) => {
  const getValue = (element) => {
    if (element.id && Object.prototype.hasOwnProperty.call(element, 'value')) {
      result[element.id] = element.value; // eslint-disable-line no-param-reassign
    }
    if (element[sub]) {
      getValues(element[sub], sub, result);
    }
  };
  if (Array.isArray(data)) {
    data.forEach(getValue);
  } else {
    getValue(data);
  }
  return result;
};

const setFieldValue = (data, field, value) => {
  const newData = Array.isArray(data) ? [...data] : { ...data };
  newData[field] = value;
  return newData;
};

const setIn = (data, path, value) => {
  const pathArray = path.split('.');

  if (pathArray.length < 2) {
    // can't make new object
    return;
  }
  const field = pathArray.pop();
  const subElementField = pathArray.pop();
  const parent = getIn(data, pathArray);
  parent[subElementField] = setFieldValue(parent[subElementField], field, value);
};

const setValues = (values, data, setData, sub = 'elements') => {
  Object.keys(values).forEach((key) => {
    const path = findPath(data, key, sub);
    if (path) {
      setIn(data, `${path}.value`, values[key]);
    }
  });
  setData('', data);
};

export {
  KateForm,
  components,
  Elements,
  reducer,
  getSetData,
  getIn,
  setIn,
  setValues,
  setFieldValue,
  createContent,
  KateFormProvider,
  getValues,
  withKateForm,
};
