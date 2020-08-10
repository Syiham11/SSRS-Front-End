import { takeEvery, call, put } from 'redux-saga/effects';
import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED
} from 'dan-actions/actionConstants';
import Axios from 'axios';
import history from '../../utils/history';

const jwtDecode = require('jwt-decode');

function login(user) {
  return Axios.post('http://localhost:9090/login', user).then(
    response => response
  );
}

function* workerSaga(action) {
  try {
    const payload = yield call(login, action.user);
    const token = payload.headers.authorization;
    const jwtdecoded = jwtDecode(token);
    if (jwtdecoded.activated) {
      if (action.isRemember) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(jwtdecoded));
      }
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(jwtdecoded));
      yield put({
        type: LOGIN_SUCCEEDED,
        authData: { accessToken: token, authorization: jwtdecoded },
        isConnected: true
      });
      history.push('/App');
    } else {
      yield put({
        type: LOGIN_FAILED,
        errorMessage: 'Your account is not activated'
      });
    }
  } catch (e) {
    if (e.toString().includes('403')) {
      yield put({
        type: LOGIN_FAILED,
        errorMessage: 'Email/Username is incorrect'
      });
    } else yield put({ type: LOGIN_FAILED, errorMessage: 'Connection Failed' });
  }
}

export default function* watcherSaga() {
  yield takeEvery(LOGIN_REQUESTED, workerSaga);
}
