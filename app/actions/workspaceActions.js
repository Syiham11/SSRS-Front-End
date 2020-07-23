import * as types from './actionConstants';

export const setTitle = title => ({
  type: types.SET_WORKSPACE_TITLE,
  title
});

export const addChart = chart => ({
  type: types.ADD_WORKSPACE_CHART,
  chart
});

export const setCharts = charts => ({
  type: types.SET_WORKSPACE_CHARTS,
  charts
});
