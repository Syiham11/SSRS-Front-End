import * as types from './actionConstants';

export const addChart = chart => ({
  type: types.ADD_DASHBOARD_CHART,
  chart
});

export const setCharts = charts => ({
  type: types.SET_DASHBOARD_CHARTS,
  charts
});

export const removeChart = index => ({
  type: types.REMOVE_DASHBOARD_CHART,
  index
});
