import { fromJS } from 'immutable';
import {
  ADD_DASHBOARD_CHART,
  SET_DASHBOARD_CHARTS,
  REMOVE_DASHBOARD_CHART
} from '../../actions/actionConstants';

const initialState = {
  charts: []
};

const initialImmutableState = fromJS(initialState);

const workspace = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case ADD_DASHBOARD_CHART: {
      const newCharts = state.toJS().charts.concat(action.chart);
      return state.withMutations(mutableState => {
        mutableState.set('charts', newCharts);
      });
    }
    case SET_DASHBOARD_CHARTS:
      return state.withMutations(mutableState => {
        mutableState.set('charts', action.charts);
      });
    case REMOVE_DASHBOARD_CHART: {
      let newCharts = state.toJS().charts;
      if (action.index === 0) {
        newCharts = newCharts.splice(1, newCharts.length);
      } else {
        newCharts = newCharts
          .splice(0, action.index)
          .concat(newCharts.splice(action.index, newCharts.length));
      }

      return state.withMutations(mutableState => {
        mutableState.set('charts', newCharts);
      });
    }
    default:
      return state;
  }
};

export default workspace;
