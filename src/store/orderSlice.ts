import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order } from '@/types/server'

interface OrderState {
    createdOrder: Order | null
}

const initialState: OrderState = {
    createdOrder: null
}

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setCreatedOrder(state, action: PayloadAction<Order | null>) {
            state.createdOrder = action.payload
        }
    }
})

export const { setCreatedOrder } = orderSlice.actions

export default orderSlice.reducer
