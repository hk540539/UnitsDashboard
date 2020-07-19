import { combineReducers } from "@reduxjs/toolkit";

// import userReducer from "./user/user.reducer";

// import cartReducer from "./cart/cart.reducer";
// import directoryReducer from "./directory/directory.reducer";
// import shopReducer from "./shop/shop.reducer";
import userReducer from "./user/userState";
import unitReducer from "./unit/unitState";
// export default combineReducers({
//   temp: tempReducer,
//   // user: userReducer,
//   // cart: cartReducer,
// });

const reducer = combineReducers({
  user: userReducer.reducer,
  unit: unitReducer.reducer,
});
export default reducer;
