import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    isLoading: true,
  },
  reducers: {
    setOrders: (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
    },
    updateOrAddOrder: (state, action) => {
      const index = state.list.findIndex(
        (order) => order._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      } else {
        state.list.unshift(action.payload);
      }
    },
  },
});

export const { setOrders, updateOrAddOrder } = orderSlice.actions;
export default orderSlice.reducer;
