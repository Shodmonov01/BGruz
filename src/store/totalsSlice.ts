import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Totals {
    fullPrice: number;
    fullPriceNds: number;
    commission: number;
}

const initialState: Totals = {
    fullPrice: 0,
    fullPriceNds: 0,
    commission: 0,
};

const totalsSlice = createSlice({
    name: 'totals',
    initialState,
    reducers: {
        setTotals(state, action: PayloadAction<Totals>) {
            state.fullPrice = action.payload.fullPrice;
            state.fullPriceNds = action.payload.fullPriceNds;
            state.commission = action.payload.commission;
        },
    },
});

export const { setTotals } = totalsSlice.actions;

export default totalsSlice.reducer; 