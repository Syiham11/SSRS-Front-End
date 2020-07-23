import { fromJS } from 'immutable';
import undoable from 'redux-undo';
import {
  FETCH_IMPORTED_DATA,
  SET_ORIGINAL_DATA,
  SET_TABLE_NAME,
  UNDO_DATA,
  REDO_DATA,
  CLEAR_DATA_HISTORY
} from 'dan-actions/actionConstants';

const initialState = {
  originalData: [],
  tableData: [],
  tableName: ''
};

const initialImmutableState = fromJS(initialState);

const importedData = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case FETCH_IMPORTED_DATA:
      return state.withMutations(mutableState => {
        mutableState.set('tableData', action.tableData);
      });
    case SET_ORIGINAL_DATA:
      return state.withMutations(mutableState => {
        mutableState.set('originalData', action.originalData);
      });
    case SET_TABLE_NAME:
      return state.withMutations(mutableState => {
        mutableState.set('tableName', action.tableName);
      });
    default:
      return state;
  }
};

const undoableImportedData = undoable(importedData, {
  undoType: UNDO_DATA,
  redoType: REDO_DATA,
  clearHistoryType: CLEAR_DATA_HISTORY
});

export default undoableImportedData;
