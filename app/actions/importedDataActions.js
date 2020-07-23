import * as types from './actionConstants';

export const setData = (tableData, id) => ({
  type: types.FETCH_IMPORTED_DATA,
  tableData,
  name: id
});

export const setOriginalData = (originalData, id) => ({
  type: types.SET_ORIGINAL_DATA,
  originalData,
  name: id
});

export const clearDataHistory = id => ({
  type: types.CLEAR_DATA_HISTORY,
  name: id
});

export const setName = (tableName, id) => ({
  type: types.SET_TABLE_NAME,
  tableName,
  name: id
});

export const undoData = id => ({
  type: 'UNDO_DATA',
  name: id
});

export const redoData = id => ({
  type: 'REDO_DATA',
  name: id
});
