import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { connectWallet, disconnectWallet } from '../../utils/wallet';
// import { fetchCurrencyBalance } from '../../utils/storage/fetch';
// import { connectWallet, disconnectWallet } from '../../utils/wallet/wallet';

const initialState = {
    connected: false,
    pkh: null,
    error: null,
};

export const connectWalletAsync = createAsyncThunk('wallet/connect', async () => {
    const wallet = await connectWallet();
    const pkh = wallet.pkh || (await wallet.getPKH());
    let currency = 0;
    return { pkh, currency };
});

export const disconnectWalletAsync = createAsyncThunk('wallet/disconnect', async () => {
    await disconnectWallet();
});

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialState,
    reducers: {
        setPKH: (state, address) => {
            state.connected = true;
            state.pkh = address.payload;
        },
        removePKH: (state) => {
            state.connected = false;
            state.pkh = null;
            state.currency = null;
        },
        setCurrency: (state, currency) => {
            state.currency = currency.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectWalletAsync.fulfilled, (state, action) => {
                state.connected = true;
                state.pkh = action.payload.pkh;
                state.currency = action.payload.currency;
            })
            .addCase(disconnectWalletAsync.fulfilled, (state, action) => {
                state.connected = false;
                state.pkh = null;
                state.currency = null;
            });
    },
});

export const { setPKH, removePKH, setCurrency } = walletSlice.actions;

export const selectConnected = (state) => state.wallet.connected;
export const selectPKH = (state) => state.wallet.pkh;
export const selectCurrency = (state) => state.wallet.currency;

export default walletSlice.reducer;