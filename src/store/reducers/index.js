import { combineReducers } from 'redux';
import user from './user';
import error from './error';

const appReducer = combineReducers({
  user,
  error,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = {};
  }
  return appReducer(state, action);
};

export default rootReducer;
