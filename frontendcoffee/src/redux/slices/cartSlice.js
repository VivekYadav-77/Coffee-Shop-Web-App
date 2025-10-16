import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};
const recalculateTotals = (state) => {
  state.totalQuantity = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  state.totalAmount = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (newItem) => newItem._id === newItem._id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          isAvailable: newItem.inStock,
        });
      }
      recalculateTotals(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const itemIndex = state.items.findIndex((item) => item._id === id);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === _id);

      if (item && quantity > 0) {
        const difference = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += difference;
        state.totalAmount += item.price * difference;
      }
    },
    syncCartItem: (state, action) => {
      const updatedProduct = action.payload;
      const itemInCart = state.items.find(
        (item) => item._id === updatedProduct._id
      );

      if (itemInCart) {
        itemInCart.isAvailable = updatedProduct.inStock;
        itemInCart.price = updatedProduct.price;
      }
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
