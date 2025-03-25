import { configureStore } from '@reduxjs/toolkit';
import bidReducer from './bidSlice';
import filterReducer from './filterSlice';
import orderReducer from './orderSlice';
import serverTimeReducer from './serverTimeSlice';
import totalsReducer from './totalsSlice';
import carouselReducer from './carouselSlice';
import formReducer from './formSlice';
import otpReducer from './otpSlice';
import toggleReducer from './toggleSlice';
import themeReducer from './themeSlice';
import sidebarReducer from './sidebarSlice';

const store = configureStore({
    reducer: {
        bids: bidReducer,
        filters: filterReducer,
        orders: orderReducer,
        serverTime: serverTimeReducer,
        totals: totalsReducer,
        carousel: carouselReducer,
        form: formReducer,
        otp: otpReducer,
        toggle: toggleReducer,
        theme: themeReducer,
        sidebar: sidebarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store; 