import { createSelector } from "@reduxjs/toolkit";

const selectUser = (state) => state.user;

export const selectToken = createSelector([selectUser], (user) => user.token);
export const selectError = createSelector([selectUser], (user) => user.error);
