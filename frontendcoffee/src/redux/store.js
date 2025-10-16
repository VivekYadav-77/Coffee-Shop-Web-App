import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.js";
import userReducer from "./slices/userSlice.js";
import menuReducer from "./slices/menuSlice.js";
import ordersReducer from "./slices/orderSlice.js";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    menu: menuReducer,
    orders: ordersReducer,
  },
});
