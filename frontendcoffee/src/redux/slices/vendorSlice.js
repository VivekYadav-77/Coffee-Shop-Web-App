import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        vendors: [],
        currentVendor: null,
        vendorMenu: [],
        myVendorProfile: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        setVendors: (state, action) => {
            state.vendors = action.payload;
            state.isLoading = false;
        },
        setCurrentVendor: (state, action) => {
            state.currentVendor = action.payload;
        },
        setVendorMenu: (state, action) => {
            state.vendorMenu = action.payload;
            state.isLoading = false;
        },
        setMyVendorProfile: (state, action) => {
            state.myVendorProfile = action.payload;
        },
        setVendorLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setVendorError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearVendorState: (state) => {
            state.currentVendor = null;
            state.vendorMenu = [];
        },
    },
});

export const {
    setVendors, setCurrentVendor, setVendorMenu,
    setMyVendorProfile, setVendorLoading, setVendorError, clearVendorState,
} = vendorSlice.actions;
export default vendorSlice.reducer;
