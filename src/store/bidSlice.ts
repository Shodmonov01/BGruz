import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Bid } from '@/types/server'

interface BidState {
    bids: Bid[]
    loading: boolean
    error: string | null
    hasMore: boolean
    newBidAdded: boolean
    newBidId: string | null
    isLocked: boolean
    createdBid: Bid | null
}

const initialState: BidState = {
    bids: [],
    loading: false,
    error: null,
    hasMore: true,
    newBidAdded: false,
    newBidId: null,
    isLocked: false,
    createdBid: null
}

const bidSlice = createSlice({
    name: 'bids',
    initialState,
    reducers: {
        setBids(state, action: PayloadAction<Bid[]>) {
            state.bids = action.payload
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload
        },
        setHasMore(state, action: PayloadAction<boolean>) {
            state.hasMore = action.payload
        },
        setNewBidAdded(state, action: PayloadAction<boolean>) {
            state.newBidAdded = action.payload
        },
        setNewBidId(state, action: PayloadAction<string | null>) {
            state.newBidId = action.payload
        },
        lockBatchOperations(state) {
            state.isLocked = true
        },
        unlockBatchOperations(state) {
            state.isLocked = false
        },
        setCreatedBid(state, action: PayloadAction<Bid | null>) {
            state.createdBid = action.payload
        },
        resetNewBid(state) {
            state.newBidAdded = false
            state.newBidId = null
        }
    }
})

export const {
    setBids,
    setLoading,
    setError,
    setHasMore,
    setNewBidAdded,
    setNewBidId,
    lockBatchOperations,
    unlockBatchOperations,
    setCreatedBid,
    resetNewBid
} = bidSlice.actions

export default bidSlice.reducer
