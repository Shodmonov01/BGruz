import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
    isMinimized: boolean;
}

const initialState: SidebarState = {
    isMinimized: true, // Default state
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isMinimized = !state.isMinimized; // Toggle the sidebar state
        },
        setSidebarState(state, action: PayloadAction<boolean>) {
            state.isMinimized = action.payload; // Set the sidebar state directly
        },
    },
});

export const { toggleSidebar, setSidebarState } = sidebarSlice.actions;
export default sidebarSlice.reducer; 