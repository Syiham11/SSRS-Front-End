import { fromJS } from 'immutable';
import {
  SET_WORKSPACE_TITLE,
  ADD_WORKSPACE_CHART,
  SET_WORKSPACE_CHARTS
} from '../../actions/actionConstants';

const initialState = {
  title: 'Workspace',
  charts: [
    {
      id: 0,
      settings: {
        choosedChart: '',
        axisList: [],
        chartParam: {
          axisX: '',
          title: '',
          xtitle: '',
          ytitle: '',
          showBrush: false,
          table: '',
          choosedColumns: ''
        },
        data: [{}]
      }
    }
  ]
};

const initialImmutableState = fromJS(initialState);

const workspace = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case SET_WORKSPACE_TITLE:
      return state.withMutations(mutableState => {
        mutableState.set('title', action.title);
      });
    case ADD_WORKSPACE_CHART: {
      const newCharts = state.toJS().charts.concat(action.chart);
      return state.withMutations(mutableState => {
        mutableState.set('charts', newCharts);
      });
    }
    case SET_WORKSPACE_CHARTS:
      return state.withMutations(mutableState => {
        mutableState.set('charts', action.charts);
      });
    default:
      return state;
  }
};

export default workspace;
