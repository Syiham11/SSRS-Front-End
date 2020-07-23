import * as types from './actionConstants';

const handleLogin = (user, isRemember) => ({
  type: types.LOGIN_REQUESTED,
  user,
  isRemember
});

export default handleLogin;
