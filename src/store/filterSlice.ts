import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    filters: { [key: string]: any };
}

const initialState: FilterState = {
    filters: {},
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<{ [key: string]: any }>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters(state) {
            state.filters = {};
        },
        handleFilterChange(state, action: PayloadAction<{ columnId: string; value: any }>) {
            const { columnId, value } = action.payload;
            state.filters[columnId] = value;
        },
    },
});

export const { setFilters, clearFilters, handleFilterChange } = filterSlice.actions;

export default filterSlice.reducer; 