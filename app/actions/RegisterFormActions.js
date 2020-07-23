import * as types from './actionConstants';

export const handleRegister = user => ({
  type: types.REGISTER_REQUESTED,
  user
});

export const registerInit = () => ({
  type: types.REGISTER_INIT
});
