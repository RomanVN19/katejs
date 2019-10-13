
export const SET_DATA = '@@kate-form/SET_DATA';

const setData = (path, data) => ({ type: SET_DATA, path, data });

export const getSetData = subPath =>
  (path, data) => setData(`${subPath || ''}${path ? '.' : ''}${path}`, data);
