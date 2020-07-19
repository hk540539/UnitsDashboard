import { call, takeEvery, put, all, delay } from "redux-saga/effects";
import axios from "axios";
import {
  signInSuccess,
  signInStart,
  signInFailure,
  signOutFailure,
  signOutSuccess,
} from "./userState";

// const login = async (url, formData) => {
//   const config = {
//     header: {
//       "Content-Type": "application/json",
//     },
//   };
//   try {
//     return await axios.post(url, formData, config);
//   } catch (err) {
//     return await err;
//   }
// };

function loginApi(authParams) {
  return axios.request({
    method: "post",
    url: "/auth/login",
    // url: "http://localhost:5000/auth/login",
    // url: "https://unitsmanagement.herokuapp.com/auth/login",
    data: authParams,
  });
}

export function* loginStart({ payload: { email, password } }) {
  try {
    let { data } = yield call(loginApi, { email, password });

    yield put(signInSuccess(data));
  } catch (error) {
    yield put(signInFailure(error.response.data.msg));
    yield delay(5000);
    yield put(signInFailure(""));
  }
}

function logoutApi() {
  return axios.request({
    method: "post",
    url: "/auth/logout",
    // url: "http://localhost:5000/auth/logout",
    // url: "https://unitsmanagement.herokuapp.com/auth/logout",
  });
}

export function* logoutStart() {
  try {
    yield call(logoutApi);

    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error.response.data.msg));
  }
}

export function* onLoginStart() {
  yield takeEvery(signInStart.toString(), loginStart);
}

export function* userSaga() {
  yield all([call(onLoginStart), call(onLogoutStart)]);
}

export function* onLogoutStart() {
  yield takeEvery("LogoutBegin", logoutStart);
}

export const logoutBegin = () => {
  return {
    type: "LogoutBegin",
  };
};
