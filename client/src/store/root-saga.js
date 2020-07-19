import { all, call } from "redux-saga/effects";

// import { shopSaga } from "./shop/shop.sagas";
// import { userSagas } from "./user/user.sagas";
// import { cartSagas } from "./cart/cart.sagas";

import { userSaga } from "./user/user.saga";
import unitSaga from "./unit/unit.saga";

export default function* rootSaga() {
  yield all([call(userSaga), call(unitSaga)]);
}
