import { fromJS } from 'immutable';
import {
  REGISTER_SUCCEEDED,
  REGISTER_FAILED,
  REGISTER_INIT
} from '../../actions/actionConstants';

const initialState = {
  errorMessage: '',
  isSucceeded: false
};

const initialImmutableState = fromJS(initialState);

const reducer = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case REGISTER_SUCCEEDED:
      return state.withMutations(mutableState => {
        mutableState.set('isSucceeded', action.isSucceeded);
        mutableState.set('errorMessage', '');
      });
    case REGISTER_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('errorMessage', action.errorMessage);
      });
    case REGISTER_INIT:
      return state.withMutations(mutableState => {
        mutableState.set('isSucceeded', false);
        mutableState.set('errorMessage', '');
      });
    default:
      return state;
  }
};

export default reducer;
