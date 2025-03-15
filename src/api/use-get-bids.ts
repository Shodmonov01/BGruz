import { useState, useCallback, useEffect, useRef } from 'react'
import { postData2, fetchPrivateData } from '@/api/api'
import { useFilter } from '@/context/filter-context'
import { useBidContext } from '@/context/bid-context'

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
    [key: string]: any
}

interface BidFilter {
    [key: string]: any
}

export const useGetBids = (size: number, sendRequest: boolean = true) => {
    const [bids, setBids] = useState<Bid[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const { filters } = useFilter()
    const { newBidAdded, newBidId, setNewBidAdded, isLocked, createdBid, setNewBidId, unlockBatchOperations } = useBidContext()

    const prevFiltersRef = useRef<BidFilter | null>(null)
    const prevSizeRef = useRef<number | null>(null)
    const isMounted = useRef(false)
    
    const lastFetchTimeRef = useRef<number>(0)
    const isFetchingRef = useRef<boolean>(false)

    const fetchSingleBid = useCallback(async (bidId: string) => {
        setLoading(true)
        setError(null)

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
            };
            
            if (transformedResponse.id && !transformedResponse._id) {
                transformedResponse._id = transformedResponse.id;
            } else if (transformedResponse._id && !transformedResponse.id) {
                transformedResponse.id = transformedResponse._id;
            } else if (!transformedResponse.id && !transformedResponse._id) {
                transformedResponse.id = bidId;
                transformedResponse._id = bidId;
            }
            
            setBids(prevBids => {
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
            setError('Не удалось загрузить заявку. Попробуйте позже.')
        } finally {
            setLoading(false)
        }
    }, [setNewBidAdded])

    const areFiltersChanged = useCallback((oldFilters: BidFilter | null, newFilters: BidFilter) => {
        if (!oldFilters) return true;
        
        const normalizeFilters = (filters: BidFilter) => {
            const normalized = { ...filters };
            
            if (normalized.status && Array.isArray(normalized.status) && 
                (normalized.status.includes('all') || normalized.status.length === 0)) {
                delete normalized.status;
            }
            
            if (normalized.cargoType && Array.isArray(normalized.cargoType) && 
                (normalized.cargoType.includes('all') || normalized.cargoType.length === 0)) {
                delete normalized.cargoType;
            }
            
            if (normalized.loadingMode && Array.isArray(normalized.loadingMode) && 
                (normalized.loadingMode.includes('all') || normalized.loadingMode.length === 0)) {
                delete normalized.loadingMode;
            }
            
            return normalized;
        };
        
        const normalizedOld = normalizeFilters(oldFilters);
        const normalizedNew = normalizeFilters(newFilters);
        
        return JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew);
    }, []);

    const fetchBids = useCallback(
        async (force = false, forceIgnoreLocks = false) => {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    if (!forceIgnoreLocks && (isLocked || (newBidAdded && newBidId))) {
                        if (newBidId) {
                            await fetchSingleBid(newBidId);
                        }
                        resolve();
                        return;
                    }
                    
                    if (isFetchingRef.current) {
                        resolve();
                        return;
                    }
                    
                    const now = Date.now();
                    if (!force && now - lastFetchTimeRef.current < 500) {
                        resolve();
                        return;
                    }

                    if (!forceIgnoreLocks && newBidAdded) {
                        resolve();
                        return;
                    }

                    setLoading(true);
                    setError(null);
                    isFetchingRef.current = true;
                    lastFetchTimeRef.current = now;

                    try {
                        const token = localStorage.getItem('authToken') || ''

                        const isFiltersChanged = areFiltersChanged(prevFiltersRef.current, filters);
                        const isSizeChanged = prevSizeRef.current !== size;

                        if (!force && !isFiltersChanged && !isSizeChanged) {
                            console.log("SKIPPING BATCH: No meaningful changes in filters or size");
                            setLoading(false);
                            isFetchingRef.current = false;
                            resolve();
                            return;
                        }

                        if (!forceIgnoreLocks && newBidAdded) {
                            console.log("LAST GUARD: newBidAdded became true, aborting");
                            setLoading(false);
                            isFetchingRef.current = false;
                            resolve();
                            return;
                        }

                        const apiFilters = { ...filters };
                        
                        if (apiFilters.status && Array.isArray(apiFilters.status)) {
                            if (apiFilters.status.includes('all')) {
                                apiFilters.status = [];
                            }
                        }
                        
                        if (apiFilters.cargoType && Array.isArray(apiFilters.cargoType)) {
                            if (apiFilters.cargoType.includes('all')) {
                                apiFilters.cargoType = [];
                            }
                        }
                        
                        if (apiFilters.loadingMode && Array.isArray(apiFilters.loadingMode)) {
                            if (apiFilters.loadingMode.includes('all')) {
                                apiFilters.loadingMode = [];
                            }
                        }
                        
                        const response = await postData2<{ items: Bid[]; total: number }>(
                            'api/v1/bids/getbatch',
                            { size, filter: apiFilters },
                            token
                        );

                        if (!forceIgnoreLocks && newBidAdded) {
                            console.log("BATCH RESULT DISCARDED: newBidAdded became true while waiting");
                        } else {
                            setBids(response.items)
                            setHasMore(response.items.length < response.total)
                        }
                        
                        resolve();
                    } catch (err) {
                        console.error('ERROR IN BATCH: Error loading bids:', err)
                        setError('Не удалось загрузить заявки. Попробуйте позже.')
                        reject(err);
                    } finally {
                        setLoading(false);
                        isFetchingRef.current = false;
                    }
                } catch (err) {
                    console.error("Unexpected error in fetchBids:", err);
                    reject(err);
                }
            });
        },
        [size, filters, newBidAdded, newBidId, fetchSingleBid, areFiltersChanged, isLocked]
    );

    useEffect(() => {
        const filtersChanged = areFiltersChanged(prevFiltersRef.current, filters);
        
        // First time setup
        if (!isMounted.current) {
            isMounted.current = true;
            
            if (sendRequest) {
                console.log("INITIAL LOAD: First batch fetch without updating prevFiltersRef");
                fetchBids().then(() => {
                    console.log("INITIAL LOAD COMPLETED: Now updating prevFiltersRef");
                    prevFiltersRef.current = { ...filters };
                    prevSizeRef.current = size;
                });
            } else {
                prevFiltersRef.current = { ...filters };
                prevSizeRef.current = size;
            }
            return;
        }
        
        if (!filtersChanged) {
            console.log("FILTER CHECK: No filter changes, skipping fetch");
            return;
        }
        
        setNewBidAdded(false);
        setNewBidId(null);
        unlockBatchOperations();

        fetchBids(true, true)
            .then(() => {
                console.log("FILTER FETCH COMPLETED: Updating filter references");
                prevFiltersRef.current = { ...filters };
                prevSizeRef.current = size;
            })
            .catch(err => {
                console.error("FILTER FETCH ERROR:", err);
            });
    }, [filters, size, fetchBids, areFiltersChanged, setNewBidAdded, setNewBidId, unlockBatchOperations, isLocked, newBidAdded, sendRequest]);

    useEffect(() => {
        if (!createdBid) return;

        const transformedBid: Bid = { 
            ...createdBid,
            client: createdBid.client || { 
                organizationName: createdBid.clientName || `Client ${createdBid.clientId}` || 'Unknown Client'
            },
            cargoTitle: createdBid.cargoTitle || createdBid.cargoType || 'Unspecified',
            price: createdBid.price === undefined ? null : createdBid.price,
            status: createdBid.status || 'waiting'
        };
        
        // Ensure both ID formats exist
        if (transformedBid.id && !transformedBid._id) {
            transformedBid._id = transformedBid.id;
        } else if (transformedBid._id && !transformedBid.id) {
            transformedBid.id = transformedBid._id;
        } else if (!transformedBid.id && !transformedBid._id) {
            // Generate a random ID if none exists
            const randomId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`Generated temporary ID for bid: ${randomId}`);
            transformedBid.id = randomId;
            transformedBid._id = randomId;
        }
        
        console.log("Transformed bid for processing:", transformedBid);
        
        // Get current filters to check if this bid should be shown
        const shouldShowBid = () => {
            // If no filters are applied, or filters include 'all', show all non-canceled bids
            if (!filters.status || 
                !Array.isArray(filters.status) || 
                filters.status.length === 0 || 
                filters.status.includes('all')) {
                return transformedBid.status !== 'canceled';
            }
            
            return filters.status.includes(transformedBid.status);
        };
        
        // Check if the bid is already in the list
        const processBidUpdate = (currentBids: Bid[] | null) => {
            const currentBidsArray = currentBids || [];
            
            const existingBidIndex = currentBidsArray.findIndex(b => 
                (b.id === transformedBid.id || b._id === transformedBid._id) ||
                (transformedBid.id && b.id === transformedBid.id) || 
                (transformedBid._id && b._id === transformedBid._id)
            );
            
            // If the bid has 'canceled' status
            if (transformedBid.status === 'canceled') {
                if (existingBidIndex >= 0) {
                    console.log("Removing canceled bid from list:", transformedBid.id || transformedBid._id);
                    const updatedBids = [...currentBidsArray];
                    updatedBids.splice(existingBidIndex, 1);
                    return updatedBids;
                }
                return currentBidsArray; // No change needed
            }
            
            if (!shouldShowBid()) {
                console.log(`Bid with status '${transformedBid.status}' not in current filters, not adding to table`);
                // If it exists but shouldn't be shown, remove it
                if (existingBidIndex >= 0) {
                    const updatedBids = [...currentBidsArray];
                    updatedBids.splice(existingBidIndex, 1);
                    return updatedBids;
                }
                return currentBidsArray; // No change needed
            }
            
            if (existingBidIndex >= 0) {
                console.log("Updating existing bid at index:", existingBidIndex);
                const updatedBids = [...currentBidsArray];
                updatedBids[existingBidIndex] = transformedBid;
                return updatedBids;
            } else {
                console.log("Adding new bid to the beginning of the list");
                return [transformedBid, ...currentBidsArray];
            }
        };
        
        setBids(processBidUpdate);
        
        if (transformedBid.id && shouldShowBid() && bids) {
            console.log("Updating hasMore flag for new bid");
            setHasMore(true); 
        }
        
    }, [createdBid, filters, bids]);

    const refreshBids = useCallback((forceIgnoreLocks = false) => {
        console.log("refreshBids called - isLocked:", isLocked, "newBidAdded:", newBidAdded, "newBidId:", newBidId, "forceIgnoreLocks:", forceIgnoreLocks);
        
        // If operations are locked or we just added a new bid, don't refresh the full list
        // unless forceIgnoreLocks is true
        if (!forceIgnoreLocks && (isLocked || (newBidAdded && newBidId))) {
            console.log("SKIPPING REFRESH: Operations locked or new bid added");
            return;
        }
        
        console.log("EXECUTING REFRESH: Forcing fetchBids");
        fetchBids(true, forceIgnoreLocks);
    }, [fetchBids, newBidAdded, newBidId, isLocked]);

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
