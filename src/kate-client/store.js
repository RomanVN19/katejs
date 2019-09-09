import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import rootReducer from './reducers';

let middleware;
if (process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(logger);
}

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, middleware);
  return store;
}
