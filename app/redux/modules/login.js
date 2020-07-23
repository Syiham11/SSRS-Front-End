import { fromJS } from 'immutable';
import { LOGIN_SUCCEEDED, LOGIN_FAILED } from '../../actions/actionConstants';

const initialState = {
  authData: {
    accessToken: '',
    jwtdecoded: {}
  },
  isConnected: false,
  errorMessage: ''
};

const initialImmutableState = fromJS(initialState);

const reducer = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case LOGIN_SUCCEEDED:
      return state.withMutations(mutableState => {
        mutableState.set('authData', action.authData);
        mutableState.set('isConnected', action.isConnected);
        mutableState.set('errorMessage', '');
      });
    case LOGIN_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('errorMessage', action.errorMessage);
      });
    default:
      return state;
  }
};

export default reducer;
