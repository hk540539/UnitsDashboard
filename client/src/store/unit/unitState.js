import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  units: [],
  error: "",
  loading: true,
  updateUnitByID: "",
};

const unitSlice = createSlice({
  name: "units",
  initialState,

  reducers: {
    getUnits: (state, action) => {
      return { ...state, units: action.payload, loading: false, error: "" };
    },
    loadingStart: (state, action) => {
      return { ...state, loading: true };
    },
    // updateUnitbyId: (state, action) => {
    //   return { ...state, updateUnitByID: action.payload };
    // },
    watchUnitsStart: () => {},
    unitErrors: (state, action) => {
      return { ...state, error: action.payload, loading: false };
    },
  },
});

export const {
  getUnits,
  watchUnitsStart,
  newUnit,
  watchAddNewUnitStart,
  unitErrors,
  filterUnits,
  loadingStart,
  updateUnitbyId,
} = unitSlice.actions;
export default unitSlice;
