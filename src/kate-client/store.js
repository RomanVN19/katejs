import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import rootReducer from './reducers';

export default function configureStore(initialState, useLogger) {
  let middleware;
  if (useLogger) {
    middleware = applyMiddleware(logger);
  }

  const store = createStore(rootReducer, initialState, middleware);
  return store;
}
