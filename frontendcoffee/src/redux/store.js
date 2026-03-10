import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.js";
import userReducer from "./slices/userSlice.js";
import menuReducer from "./slices/menuSlice.js";
import ordersReducer from "./slices/orderSlice.js";
import vendorReducer from "./slices/vendorSlice.js";
import disputeReducer from "./slices/disputeSlice.js";
import walletReducer from "./slices/walletSlice.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    menu: menuReducer,
    orders: ordersReducer,
    vendor: vendorReducer,
    disputes: disputeReducer,
    wallet: walletReducer,
  },
});
