import { createSlice } from "@reduxjs/toolkit";

const disputeSlice = createSlice({
    name: "disputes",
    initialState: {
        list: [],
        currentDispute: null,
        isLoading: false,
    },
    reducers: {
        setDisputes: (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        },
        addDispute: (state, action) => {
            state.list.unshift(action.payload);
        },
        updateDispute: (state, action) => {
            const idx = state.list.findIndex((d) => d._id === action.payload._id);
            if (idx !== -1) state.list[idx] = action.payload;
        },
        setCurrentDispute: (state, action) => {
            state.currentDispute = action.payload;
        },
        setDisputeLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setDisputes, addDispute, updateDispute, setCurrentDispute, setDisputeLoading } =
    disputeSlice.actions;
export default disputeSlice.reducer;
