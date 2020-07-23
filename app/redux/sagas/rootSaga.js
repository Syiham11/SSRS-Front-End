import { spawn } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registerSaga from './registerSaga';

export default function* rootSaga() {
  yield spawn(loginSaga);
  yield spawn(registerSaga);
}
