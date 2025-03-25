import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
    data: { [key: string]: any };
}

const initialState: FormState = {
    data: {},
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setFormData(state, action: PayloadAction<{ [key: string]: any }>) {
            state.data = { ...state.data, ...action.payload };
        },
        clearFormData(state) {
            state.data = {};
        },
    },
});

export const { setFormData, clearFormData } = formSlice.actions;
export default formSlice.reducer; 