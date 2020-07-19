import { put, call, takeEvery, all, takeLatest } from "redux-saga/effects";
// import unitTypes from "./unit.types";
import axios from "axios";
import {
  getUnits,
  watchUnitsStart,
  unitErrors,
  loadingStart,
} from "./unitState";

//  Api's section

const getUnitsCall = (url) => {

    const config = {
      header: {
        'Content-Type': 'application/json'
      }
    }

  return axios.get(url,config);
};

export function* getUnitsStart() {
  try {
    let { data } = yield call(getUnitsCall, "http://192.168.0.111:5000/unit");
    yield put(getUnits(data));
  } catch (error) {
    unitErrors(error);
  }
}

function uploadUnit(newUnit) {

    const config = {
      header: {
        'Content-Type': 'application/json'
      }
    }

  try {
    return axios.request({
      method: "post",
      // url: "http://localhost:5000/unit",
      // url: "https://unitsmanagement.herokuapp.com/unit",
      url: "/unit",
      data: newUnit,config
    });
  } catch (error) {
    console.log(error);
  }
}

export function* addNewUnit({
  payload: {
    unitName,
    location,
    startedAt,
    activeUpto,
    employees,
    active,
    sector,
    typesOfService,
  },
}) {
  try {
    yield call(uploadUnit, {
      unitName,
      location,
      startedAt,
      activeUpto,
      employees,
      active,
      sector,
      typesOfService,
    });
    yield put(loadingStart());

    yield getUnitsStart();
  } catch ({
    response: {
      data: { errors },
    },
  }) {
    if (errors) {
      yield put(unitErrors("Please fill required fields"));
    }
  }
}

function deleteUnits(unitIds) {

    const config = {
      header: {
        'Content-Type': 'application/json'
      }
    }

  return axios.request({
    method: "delete",
    // url: "http://localhost:5000/unit",
    // url: "https://unitsmanagement.herokuapp.com/unit",
    url: "/unit",
    data: unitIds,config
  });
}

export function* deleteUnit({ payload }) {
  try {
    yield call(deleteUnits, {
      payload,
    });
    yield put(loadingStart());

    yield getUnitsStart();
  } catch ({
    response: {
      data: { errors },
    },
  }) {
    if (errors) {
      yield put(unitErrors("Please fill required fields"));
    }
  }
}

function updateUnitCall(id, newUnit) {

    const config = {
      header: {
        'Content-Type': 'application/json'
      }
    }

  try {
    return axios.request({
      method: "patch",
      // url: `http://localhost:5000/unit/${id}`,
      // url: `https://unitsmanagement.herokuapp.com/${id}`,
      url: `/unit/${id}`,
      data: newUnit,config
    });
  } catch (error) {
    console.log(error);
  }
}

export function* updateUnit({ payload: { id, filledProps } }) {
  console.log(id, filledProps);
  try {
    yield call(updateUnitCall, id, filledProps[0]);
    yield put(loadingStart());

    yield getUnitsStart();
  } catch ({
    response: {
      data: { errors },
    },
  }) {
    if (errors) {
      yield put(unitErrors("Update Error"));
    }
  }
}

//

// watchers section

export function* watchUpdateUnitStarts() {
  yield takeLatest("watchUpdateUnitStart", updateUnit);
}

export function* watchDeleteNewUnitStarts() {
  yield takeLatest("watchDeleteNewUnitStart", deleteUnit);
}

export function* watchAddNewUnitStarts() {
  yield takeLatest("watchAddNewUnitStart", addNewUnit);
}

export function* watchUnitStart() {
  yield takeEvery(watchUnitsStart.toString(), getUnitsStart);
}

export default function* rootUnits() {
  yield all([
    call(watchUnitStart),
    call(watchAddNewUnitStarts),
    call(watchDeleteNewUnitStarts),
    call(watchUpdateUnitStarts),
  ]);
}

// actions only for getting payload

export const watchAddNewUnitStart = (payload) => ({
  type: "watchAddNewUnitStart",
  payload: payload,
});

export const watchDeleteNewUnitStart = (payload) => ({
  type: "watchDeleteNewUnitStart",
  payload: payload,
});

export const watchUpdateUnitStart = (payload) => ({
  type: "watchUpdateUnitStart",
  payload: payload,
});
