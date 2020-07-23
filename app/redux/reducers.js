/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { reducer as form } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import history from 'utils/history';

import languageProviderReducer from 'containers/LanguageProvider/reducer';
import login from './modules/login';
import uiReducer from './modules/ui';
import initval from './modules/initForm';
import importedData from './modules/importedData';
import workspace from './modules/workspace';
import dashboard from './modules/dashboard';
import register from './modules/register';

const createNamedWrapperReducer = (reducerFunction, reducerName) => (
  state,
  action
) => {
  const { name } = action;
  const isInitializationCall = state === undefined;
  if (name !== reducerName && !isInitializationCall) return state;

  return reducerFunction(state, action);
};

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    form,
    login,
    ui: uiReducer,
    initval,
    importedData1: createNamedWrapperReducer(importedData, '1'),
    importedData2: createNamedWrapperReducer(importedData, '2'),
    importedData3: createNamedWrapperReducer(importedData, '3'),
    workspace,
    dashboard,
    register,
    language: languageProviderReducer,
    router: connectRouter(history),
    ...injectedReducers
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);
  return mergeWithRouterState(rootReducer);
}
