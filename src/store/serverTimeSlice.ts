import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServerTimeState {
    serverTime: number | null;
}

const initialState: ServerTimeState = {
    serverTime: null,
};

const serverTimeSlice = createSlice({
    name: 'serverTime',
    initialState,
    reducers: {
        setServerTime(state, action: PayloadAction<number | null>) {
            state.serverTime = action.payload;
        },
    },
});

export const { setServerTime } = serverTimeSlice.actions;

export default serverTimeSlice.reducer; 