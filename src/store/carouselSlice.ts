import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CarouselState {
    currentIndex: number;
}

const initialState: CarouselState = {
    currentIndex: 0,
};

const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        setCurrentIndex(state, action: PayloadAction<number>) {
            state.currentIndex = action.payload;
        },
    },
});

export const { setCurrentIndex } = carouselSlice.actions;
export default carouselSlice.reducer; 