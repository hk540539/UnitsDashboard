import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: "",
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        currentUser: action.payload.user,
        token: action.payload.token,
        error: "",
      };
    },
    signOutSuccess: (state, action) => {
      localStorage.removeItem("token");
      return {
        ...state,
        currentUser: null,
        token: "",
        error: "",
      };
    },
    signInStart: (state, action) => {
      return { ...state, error: "", payload: action.payload };
    },
    signOutFailure: (state, action) => {
      return {
        ...state,
        error: action.payload,
        currentUser: null,
        token: null,
      };
    },
    signInFailure: (state, action) => {
      return {
        ...state,
        error: action.payload,
        currentUser: null,
        token: null,
      };
    },
  },
});

export const {
  signInSuccess,
  signInStart,
  signInFailure,
  signOutFailure,
  signOutSuccess,
} = authSlice.actions;

export default authSlice;
