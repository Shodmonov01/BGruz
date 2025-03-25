import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
    theme: Theme;
}

const initialState: ThemeState = {
    theme: 'system', // Default theme
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<Theme>) {
            state.theme = action.payload; // Update the theme
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer; 