import { takeEvery, call, put } from 'redux-saga/effects';
import {
  REGISTER_REQUESTED,
  REGISTER_SUCCEEDED,
  REGISTER_FAILED
} from 'dan-actions/actionConstants';
import axios from 'axios';
import { API } from '../../config/apiUrl';

const API_URL = API;

function checkExist(user) {
  return axios
    .post(`${API_URL}/user/checkRegister`, user)
    .then(response => response.data);
}

function registerUser(user) {
  return axios
    .post(`${API_URL}/user/register`, user)
    .then(response => response.data);
}

function* workerSaga(action) {
  try {
    const payload = yield call(checkExist, action.user);
    if (payload === 'username exist') {
      yield put({
        type: REGISTER_FAILED,
        errorMessage: 'Username already exist'
      });
    } else if (payload === 'email exist') {
      yield put({ type: REGISTER_FAILED, errorMessage: 'Email already exist' });
    } else {
      const payload2 = yield call(registerUser, action.user);
      if (payload2 !== '') {
        yield put({ type: REGISTER_SUCCEEDED, isSucceeded: true });
      } else yield put({ REGISTER_FAILED, errorMessage: 'Connection Failed' });
    }
  } catch (e) {
    yield put({ type: REGISTER_FAILED, errorMessage: 'Connection Failed' });
  }
}

export default function* watcherSaga() {
  yield takeEvery(REGISTER_REQUESTED, workerSaga);
}
