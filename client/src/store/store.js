import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import logger from "redux-logger";

import rootReducer from "./root-reducer";

import createSagaMiddleware from "redux-saga";

import rootSaga from "./root-saga";
const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

sagaMiddleware.run(rootSaga);

export default store;

// export default () => {
//   const store = configureStore({
//     reducer: rootReducer,
//     middleware,
//   });
//   sagaMiddleware.run(rootSaga);
//   return store;
// };
