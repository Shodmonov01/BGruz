import { configureStore } from '@reduxjs/toolkit';
import bidReducer from './bidSlice';
import filterReducer from './filterSlice';
import orderReducer from './orderSlice';
import serverTimeReducer from './serverTimeSlice';
import totalsReducer from './totalsSlice';
import formReducer from './formSlice';
import otpReducer from './otpSlice';
import toggleReducer from './toggleSlice';
import sidebarReducer from './sidebarSlice';

const store = configureStore({
    reducer: {
        bids: bidReducer,
        filters: filterReducer,
        orders: orderReducer,
        serverTime: serverTimeReducer,
        totals: totalsReducer,
        form: formReducer,
        otp: otpReducer,
        toggle: toggleReducer,
        sidebar: sidebarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store; 