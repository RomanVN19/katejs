import { combineReducers } from 'redux';

import { reducer } from 'kate-form';

const rootReducer = combineReducers({
  'kate-form': reducer,
});

export default rootReducer;
