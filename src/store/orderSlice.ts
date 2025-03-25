import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from '@/types';

interface OrderState {
    createdOrder: IOrder | null;
}

const initialState: OrderState = {
    createdOrder: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setCreatedOrder(state, action: PayloadAction<IOrder | null>) {
            state.createdOrder = action.payload;
        },
    },
});

export const { setCreatedOrder } = orderSlice.actions;

export default orderSlice.reducer; 