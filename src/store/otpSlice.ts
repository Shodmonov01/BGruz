import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OtpState {
    value: string;
}

const initialState: OtpState = {
    value: '',
};

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        setOtp: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        clearOtp(state) {
            state.value = '';
        },
    },
});

export const { setOtp, clearOtp } = otpSlice.actions;
export default otpSlice.reducer; 