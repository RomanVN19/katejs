import React from 'react';
import { components as defaultcomponents } from './components';

const { Provider, Consumer } = React.createContext({
  components: defaultcomponents,
  logRerender: false,
  t: value => value,
});

const KateFormProvider = ({ components, logRerender, t, children }) => (
  <Provider value={{ components, logRerender, t }}>
    {children}
  </Provider>
);

export {
  KateFormProvider,
  Consumer,
};
