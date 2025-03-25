import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToggleState {
    state: string; // or boolean, depending on your toggle logic
}

const initialState: ToggleState = {
    state: 'default', // or whatever your default state is
};

const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        setToggleState(state, action: PayloadAction<string>) {
            state.state = action.payload;
        },
    },
});

export const { setToggleState } = toggleSlice.actions;
export default toggleSlice.reducer; 