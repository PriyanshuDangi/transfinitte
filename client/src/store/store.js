import { configureStore } from '@reduxjs/toolkit';
import storageReducer from './reducers/storage';
import walletReducer from "./reducers/walletSlice"

export default configureStore({
    reducer: {
        storage: storageReducer,
        wallet: walletReducer
    },
});
