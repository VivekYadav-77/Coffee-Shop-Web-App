import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
    name: "wallet",
    initialState: {
        balance: 0,
        transactions: [],
        isLoading: false,
    },
    reducers: {
        setBalance: (state, action) => {
            state.balance = action.payload;
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload;
            state.isLoading = false;
        },
        setWalletLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setBalance, setTransactions, setWalletLoading } = walletSlice.actions;
export default walletSlice.reducer;
