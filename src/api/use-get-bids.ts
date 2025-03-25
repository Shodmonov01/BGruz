import { useState, useCallback, useEffect, useRef } from 'react'
import { postData2, fetchPrivateData } from '@/api/api'
import { useFilter } from '@/context/filter-context'
import { useBidContext } from '@/context/bid-context'
import { useDispatch, useSelector } from 'react-redux'
import { setBids, setLoading, setError, setHasMore } from '@/store/bidSlice'

interface Bid {
    _id?: string
    id?: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
    clientId?: number | null
    clientName?: string | null
    cargoType?: string | null
    organizationId?: string | number   
    [key: string]: any
}

interface BidFilter {
    [key: string]: any
}

export const useGetBids = (size: number, page: number, sendRequest: boolean = true) => {
    const dispatch = useDispatch()
    const { bids, loading, error, hasMore } = useSelector((state) => state.bids)
    const [allBids, setAllBids] = useState<Bid[] | null>(null)
    const { filters, handleFilterChange } = useFilter()
    const { newBidAdded, newBidId, setNewBidAdded, isLocked, createdBid, setNewBidId, unlockBatchOperations } = useBidContext()
    const isMounted = useRef(false)

    const prevFiltersRef = useRef<BidFilter | null>(null)
    const prevSizeRef = useRef<number | null>(null)
    const lastFetchTimeRef = useRef<number>(0)
    const isFetchingRef = useRef<boolean>(false)
    const [lastFetchedFilters, setLastFetchedFilters] = useState<BidFilter | null>(null)

    const fetchSingleBid = useCallback(async (bidId: string) => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const token = localStorage.getItem('authToken') || ''
            const response = await fetchPrivateData<Bid>(`api/v1/bids/${bidId}`, token)
            
            const transformedResponse: Bid = { 
                ...response,
                client: response.client || { 
                    organizationName: response.clientName || `Client ${response.clientId}` || 'Unknown Client'
                },
                cargoTitle: response.cargoTitle || response.cargoType || 'Unspecified',
                price: response.price === undefined ? null : response.price,
                status: response.status || 'waiting'
            }
            
            if (transformedResponse.id && !transformedResponse._id) {
                transformedResponse._id = transformedResponse.id
            } else if (transformedResponse._id && !transformedResponse.id) {
                transformedResponse.id = transformedResponse._id
            } else if (!transformedResponse.id && !transformedResponse._id) {
                transformedResponse.id = bidId
                transformedResponse._id = bidId
            }
            
            setAllBids(prevBids => {
                if (!prevBids) return [transformedResponse]
                
                const existingIndex = prevBids.findIndex(b => 
                    (b.id === bidId || b._id === bidId) || 
                    (b.id === transformedResponse.id || b._id === transformedResponse._id)
                )
                
                if (existingIndex >= 0) {
                    const newBids = [...prevBids]
                    newBids[existingIndex] = transformedResponse
                    return newBids
                }
                
                return [transformedResponse, ...prevBids]
            })
            
            setNewBidAdded(false)
        } catch (err) {
            console.error('Error fetching individual bid:', err)
            dispatch(setError('Не удалось загрузить заявку. Попробуйте позже.'))
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, setNewBidAdded])

    const areFiltersChanged = useCallback((oldFilters: BidFilter | null, newFilters: BidFilter) => {
        if (!oldFilters) return true
        
        const normalizeFilters = (filters: BidFilter) => {
            const normalized = { ...filters }
            
            if (normalized.status && Array.isArray(normalized.status) && 
                (normalized.status.includes('all') || normalized.status.length === 0)) {
                delete normalized.status
            }
            
            if (normalized.cargoType && Array.isArray(normalized.cargoType) && 
                (normalized.cargoType.includes('all') || normalized.cargoType.length === 0)) {
                delete normalized.cargoType
            }
            
            if (normalized.loadingMode && Array.isArray(normalized.loadingMode) && 
                (normalized.loadingMode.includes('all') || normalized.loadingMode.length === 0)) {
                delete normalized.loadingMode
            }
            
            return normalized
        }
        
        const normalizedOld = normalizeFilters(oldFilters)
        const normalizedNew = normalizeFilters(newFilters)
        
        return JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)
    }, [])

    const fetchBids = useCallback(async () => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const token = localStorage.getItem('authToken') || ''
            const response = await postData2<{ items: Bid[]; total: number }>(
                'api/v1/bids/getbatch',
                { size, page },
                token
            )

            setAllBids(response.items)
            dispatch(setBids(response.items))
            dispatch(setHasMore(response.items.length < response.total))
        } catch (err) {
            console.error('Error loading bids:', err)
            dispatch(setError('Не удалось загрузить заявки. Попробуйте позже.'))
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, size, page])

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            if (sendRequest) {
                fetchBids()
            }
            return
        }
    }, [fetchBids, sendRequest])

    useEffect(() => {
        const filtersChanged = areFiltersChanged(prevFiltersRef.current, filters)
        
        if (!isMounted.current) {
            isMounted.current = true
            
            if (!filters.status || filters.status.length === 0) {
                handleFilterChange('status', ['active_waiting'])
            }
            
            if (sendRequest) {
                console.log("INITIAL LOAD: First batch fetch without updating prevFiltersRef")
                fetchBids().then(() => {
                    console.log("INITIAL LOAD COMPLETED: Now updating prevFiltersRef")
                    prevFiltersRef.current = { ...filters }
                    prevSizeRef.current = size
                })
            } else {
                prevFiltersRef.current = { ...filters }
                prevSizeRef.current = size
            }
            return
        }
        
        if (!filtersChanged) {
            console.log("FILTER CHECK: No filter changes, skipping filter")
            return
        }
        
        console.log("FILTER CHANGED: Attempting client-side filtering first")
        
        if (allBids && allBids.length > 0) {
            const requiresServerFetch = shouldFetchFromServer(lastFetchedFilters, filters)
            
            if (!requiresServerFetch) {
                console.log("APPLYING CLIENT-SIDE FILTERING")
                const filteredBids = filterBidsClientSide(allBids, filters)
                dispatch(setBids(filteredBids))
                prevFiltersRef.current = { ...filters }
                return
            } else {
                console.log("FILTER REQUIRES SERVER FETCH - can't filter client-side")
            }
        }
        
        console.log("FALLING BACK TO SERVER FILTERING")
        setNewBidAdded(false)
        setNewBidId(null)
        unlockBatchOperations()

        fetchBids()
            .then(() => {
                console.log("FILTER FETCH COMPLETED: Updating filter references")
                prevFiltersRef.current = { ...filters }
                prevSizeRef.current = size
            })
            .catch(err => {
                console.error("FILTER FETCH ERROR:", err)
            })
    }, [dispatch, filters, size, fetchBids, areFiltersChanged, setNewBidAdded, setNewBidId, unlockBatchOperations, allBids, lastFetchedFilters, sendRequest])

    useEffect(() => {
        if (!isMounted.current) return
        
        if (prevSizeRef.current === size) return
        
        if (isLocked || newBidAdded) {
            console.log(`SIZE CHANGED: from ${prevSizeRef.current} to ${size}, but SKIPPING fetch due to locks or new bid`)
            prevSizeRef.current = size
            return
        }
        
        if (allBids && allBids.length >= size) {
            console.log(`SIZE CHANGED: from ${prevSizeRef.current} to ${size}, using existing data`)
            
            const filteredBids = filterBidsClientSide(allBids, filters)
            
            if (filteredBids.length >= size) {
                console.log(`Using ${size} of ${filteredBids.length} filtered bids from memory`)
                dispatch(setBids(filteredBids.slice(0, size)))
                prevSizeRef.current = size
                return
            }
        }
        
        console.log(`SIZE CHANGED: from ${prevSizeRef.current} to ${size}, fetching more bids`)
        
        fetchBids()
            .then(() => {
                console.log("SIZE CHANGE FETCH COMPLETED")
                prevSizeRef.current = size
            })
            .catch(err => {
                console.error("SIZE FETCH ERROR:", err)
            })
    }, [dispatch, size, fetchBids, isLocked, newBidAdded, allBids, filters])

    useEffect(() => {
        if (!createdBid) return

        const transformedBid: Bid = { 
            ...createdBid,
            client: createdBid.client || { 
                organizationName: createdBid.clientName || `Client ${createdBid.clientId}` || 'Unknown Client'
            },
            cargoTitle: createdBid.cargoTitle || createdBid.cargoType || 'Unspecified',
            price: createdBid.price === undefined ? null : createdBid.price,
            status: createdBid.status || 'waiting'
        }
        
        if (transformedBid.id && !transformedBid._id) {
            transformedBid._id = transformedBid.id
        } else if (transformedBid._id && !transformedBid.id) {
            transformedBid.id = transformedBid._id
        } else if (!transformedBid.id && !transformedBid._id) {
            const randomId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            console.log(`Generated temporary ID for bid: ${randomId}`)
            transformedBid.id = randomId
            transformedBid._id = randomId
        }
        
        console.log("Transformed bid for processing:", transformedBid)
        
        const shouldShowBid = () => {
           if (!filters.status || 
                !Array.isArray(filters.status) || 
                filters.status.length === 0 || 
                filters.status.includes('all')) {
                return transformedBid.status !== 'canceled'
            }
            
            return filters.status.includes(transformedBid.status)
        }
        
        const processBidUpdate = (currentBids: Bid[] | null) => {
            const currentBidsArray = currentBids || []
            
            const existingBidIndex = currentBidsArray.findIndex(b => 
                (b.id === transformedBid.id || b._id === transformedBid._id) ||
                (transformedBid.id && b.id === transformedBid.id) || 
                (transformedBid._id && b._id === transformedBid._id)
            )
            
            if (transformedBid.status === 'canceled') {
                if (existingBidIndex >= 0) {
                    console.log("Removing canceled bid from list:", transformedBid.id || transformedBid._id)
                    const updatedBids = [...currentBidsArray]
                    updatedBids.splice(existingBidIndex, 1)
                    return updatedBids
                }
                return currentBidsArray
            }
            
            if (!shouldShowBid()) {
                console.log(`Bid with status '${transformedBid.status}' not in current filters, not adding to table`)
               if (existingBidIndex >= 0) {
                    const updatedBids = [...currentBidsArray]
                    updatedBids.splice(existingBidIndex, 1)
                    return updatedBids
                }
                return currentBidsArray
            }
            
            if (existingBidIndex >= 0) {
                console.log("Updating existing bid at index:", existingBidIndex)
                const updatedBids = [...currentBidsArray]
                updatedBids[existingBidIndex] = transformedBid
                return updatedBids
            } else {
                console.log("Adding new bid to the beginning of the list")
                return [transformedBid, ...currentBidsArray]
            }
        }
        
        dispatch(setBids(processBidUpdate))
        
        if (transformedBid.id && shouldShowBid() && bids) {
            console.log("Updating hasMore flag for new bid")
            dispatch(setHasMore(true)) 
        }
    }, [createdBid, dispatch, bids])

    const refreshBids = useCallback((forceIgnoreLocks = false) => {
        console.log("refreshBids called - isLocked:", isLocked, "newBidAdded:", newBidAdded, "newBidId:", newBidId, "forceIgnoreLocks:", forceIgnoreLocks)
        
        if (!forceIgnoreLocks && (isLocked || (newBidAdded && newBidId))) {
            console.log("SKIPPING REFRESH: Operations locked or new bid added")
            return
        }
        
        console.log("EXECUTING REFRESH: Forcing fetchBids")
        fetchBids()
    }, [fetchBids, newBidAdded, newBidId, isLocked])

    return {
        bids,
        loading,
        error,
        hasMore,
        refreshBids
    }
}

export const useGetBid = (bidId: string | null) => {
    const [bid, setBid] = useState<Bid | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchBid = useCallback(async () => {
        if (!bidId) {
            setBid(null)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('authToken') || ''
            const response = await fetchPrivateData<Bid>(`api/v1/bids/${bidId}`, token)
            setBid(response)
        } catch (err) {
            console.error('Ошибка при загрузке заявки:', err)
            setError('Не удалось загрузить заявку. Попробуйте позже.')
        } finally {
            setLoading(false)
        }
    }, [bidId])

    useEffect(() => {
        if (bidId) {
            fetchBid()
        } else {
            setBid(null)
        }
    }, [bidId, fetchBid])

    return {
        bid,
        loading,
        error,
        refreshBid: fetchBid,
        setBid
    }
}

const filterBidsClientSide = (bids: Bid[], currentFilters: BidFilter): Bid[] => {
    return bids.filter(bid => {
        if (currentFilters.status && 
            Array.isArray(currentFilters.status) && 
            currentFilters.status.length > 0 && 
            !currentFilters.status.includes('all')) {
            if (!bid.status || !currentFilters.status.includes(bid.status)) {
                return false
            }
        }
        
        if (currentFilters.cargoType && 
            Array.isArray(currentFilters.cargoType) && 
            currentFilters.cargoType.length > 0 && 
            !currentFilters.cargoType.includes('all')) {
            if (!bid.cargoType && !bid.transportType) {
                return false
            }
            const bidCargoType = bid.cargoType || bid.transportType
            if (!currentFilters.cargoType.includes(bidCargoType)) {
                return false
            }
        }
        
        if (currentFilters.loadingMode && 
            Array.isArray(currentFilters.loadingMode) && 
            currentFilters.loadingMode.length > 0 && 
            !currentFilters.loadingMode.includes('all')) {
            if (!bid.loadingMode) {
                return false
            }
            if (!currentFilters.loadingMode.includes(bid.loadingMode)) {
                return false
            }
        }
        
        return true
    })
}

const shouldFetchFromServer = (lastFilters: BidFilter | null, currentFilters: BidFilter): boolean => {
    if (!lastFilters) return true
    
    if (lastFilters.status && Array.isArray(lastFilters.status)) {
        if (currentFilters.status && Array.isArray(currentFilters.status)) {
            if (lastFilters.status.length > currentFilters.status.length || 
                (currentFilters.status.includes('all') && !lastFilters.status.includes('all'))) {
                return true
            }
        }
    }
    
    if (lastFilters.cargoType && Array.isArray(lastFilters.cargoType)) {
        if (currentFilters.cargoType && Array.isArray(currentFilters.cargoType)) {
            if (lastFilters.cargoType.length > currentFilters.cargoType.length || 
                (currentFilters.cargoType.includes('all') && !lastFilters.cargoType.includes('all'))) {
                return true
            }
        }
    }
    
    if (lastFilters.loadingMode && Array.isArray(lastFilters.loadingMode)) {
        if (currentFilters.loadingMode && Array.isArray(currentFilters.loadingMode)) {
            if (lastFilters.loadingMode.length > currentFilters.loadingMode.length || 
                (currentFilters.loadingMode.includes('all') && !lastFilters.loadingMode.includes('all'))) {
                return true
            }
        }
    }
    
    return false
}
