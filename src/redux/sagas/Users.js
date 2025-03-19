import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { fetchUsersSuccess, fetchUsersFail, deleteUserSuccess, deleteUserFail, fetchUserByIdSuccess, fetchUserByIdFail } from "redux/actions";
import { API_BASE_URL } from "configs/AppConfig";
import { DELETE_USER_REQUEST, FETCH_USER_BY_ID_REQUEST, FETCH_USERS_REQUEST, UPDATE_USER } from "redux/constants/Users";
import { message } from "antd";

export function* getUsers() {
  yield takeEvery(FETCH_USERS_REQUEST, function* () {
    try {
      const response = yield call(axios.get, `${API_BASE_URL}/users`);
      yield put(fetchUsersSuccess(response.data));
    } catch (e) {
      yield put(fetchUsersFail(e.message));
    }
  })
}

export function* deleteUser() {
  yield takeEvery(DELETE_USER_REQUEST, function* ({ payload }) {
    try {
      yield call(axios.delete, `${API_BASE_URL}/users/${payload}`);
      yield put(deleteUserSuccess(payload));
      message.success({ content: `Deleted user ${payload}`, duration: 2 });
    } catch (e) {
      yield put(deleteUserFail(e.message));
    }
  })
}

export function* getUserById() {
  yield takeEvery(FETCH_USER_BY_ID_REQUEST, function* ({ payload }) {
    try {
      const user = yield call(axios.get, `${API_BASE_URL}/users/${payload}`);
      yield put(fetchUserByIdSuccess(user.data));
    } catch (e) {
      yield put(fetchUserByIdFail(e.message));
    }
  })
}

export function* updateUser() {
  yield takeEvery(UPDATE_USER, function* ({ payload }) {
    try {
      yield put(updateUser(payload));
    } catch (e) {
      yield put(fetchUserByIdFail(e.message));
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(getUsers),
    fork(deleteUser),
    fork(getUserById),
    fork(updateUser),
  ]);
}