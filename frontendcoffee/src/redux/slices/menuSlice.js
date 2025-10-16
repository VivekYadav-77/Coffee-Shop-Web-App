import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: true,
  selectedItem: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    addMenuItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateMenuItemState: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedItem?._id === action.payload._id) {
        state.selectedItem = action.payload;
      }
    },
    removeMenuItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
  },
});

export const {
  setMenuItems,
  addMenuItem,
  setSelectedItem,
  updateMenuItemState,
  removeMenuItem,
} = menuSlice.actions;

export default menuSlice.reducer;
