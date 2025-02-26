// import { useEffect, useState, useCallback } from 'react'
// import { postData2 } from '@/api/api'

// interface BidFilter {
//     number?: number
//     clientId?: number
//     status?: string[]
//     clientName?: string
// }

// interface Bid {
//     persistentId: string
//     cargoTitle: string
//     clientId: number
//     price: number
//     status: string | null
//     startDate: string
//     client: { organizationName: string }
//     terminal1: { cityName: string; address: string }
//     terminal2: { cityName: string; address: string }
// }

// export const useGetBids = (size: number) => {
//     const [bids, setBids] = useState<Bid[] | null>(null)
//     const [loading, setLoading] = useState<boolean>(true)
//     const [error, setError] = useState<string | null>(null)
//     const [hasMore, setHasMore] = useState<boolean>(true)
//     const [filters, setFilters] = useState<BidFilter>({})
//     const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

//     const fetchBids = useCallback(async () => {
//         setLoading(true)
//         setError(null)

//         try {
//             const token = localStorage.getItem('authToken') || ''
//             const response = await postData2<{ items: Bid[]; total: number }>(
//                 'api/v1/bids/getbatch',
//                 { size, filter: filters },
//                 token
//             )

//             // console.log('Ответ от API:', response.items)
//             setBids(response.items)
//             setHasMore(response.items.length < response.total)
//         } catch (err) {
//             console.error('Ошибка при загрузке заявок:', err)
//             setError('Не удалось загрузить заявки. Попробуйте позже.')
//         } finally {
//             setLoading(false)
//         }
//     }, [size, filters])

//     useEffect(() => {
//         fetchBids()
//     }, [size, filters, refreshTrigger, fetchBids])

//     const refreshBids = useCallback(() => {
//         fetchBids()
//     }, [fetchBids])

//     return {
//         bids,
//         loading,
//         error,
//         hasMore,
//         setFilters,
//         refreshTable: () => setRefreshTrigger(prev => prev + 1),
//         refreshBids
//     }
// }


import { useState, useCallback, useEffect, useRef } from 'react'
import { postData2 } from '@/api/api'

interface Bid {
    _id?: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
}

interface BidFilter {
    [key: string]: any
}

export const useGetBids = (size: number) => {
    const [bids, setBids] = useState<Bid[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [filters, setFilters] = useState<BidFilter>({})
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

    const prevFiltersRef = useRef<BidFilter>({})

//     const fetchBids = useCallback(async (force = false) => {
//         setLoading(true)
//         setError(null)

//         try {
//             const token = localStorage.getItem('authToken') || ''

//             // Проверяем, если фильтры изменились, тогда выполняем запрос
//             const isFiltersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)

//             if (!force && !isFiltersChanged) {
//                 setLoading(false)
//                 return
//             }

//             prevFiltersRef.current = filters

//             const response = await postData2<{ items: Bid[]; total: number }>(
//                 'api/v1/bids/getbatch',
//                 { size, filter: filters },
//                 token
//             )

//             setBids(response.items)
//             setHasMore(response.items.length < response.total)
//         } catch (err) {
//             console.error('Ошибка при загрузке заявок:', err)
//             setError('Не удалось загрузить заявки. Попробуйте позже.')
//         } finally {
//             setLoading(false)
//         }
//     }, [size, filters])

//     useEffect(() => {
//         fetchBids()
//     }, [size, filters, refreshTrigger])

//     const refreshBids = useCallback(() => {
//         fetchBids(true) // Принудительное обновление
//     }, [fetchBids])

//     return { bids, loading, error, hasMore, setFilters, refreshTable: () => setRefreshTrigger(prev => prev + 1), refreshBids }
// }


const filtersRef = useRef<BidFilter>({})

const fetchBids = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)

    try {
        const token = localStorage.getItem('authToken') || ''

        // Берем актуальные фильтры из ref
        const currentFilters = filtersRef.current
        const isFiltersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(currentFilters)

        if (!force && !isFiltersChanged) {
            setLoading(false)
            return
        }

        prevFiltersRef.current = currentFilters

        const response = await postData2<{ items: Bid[]; total: number }>(
            'api/v1/bids/getbatch',
            { size, filter: currentFilters },
            token
        )

        setBids(response.items)
        setHasMore(response.items.length < response.total)
    } catch (err) {
        console.error('Ошибка при загрузке заявок:', err)
        setError('Не удалось загрузить заявки. Попробуйте позже.')
    } finally {
        setLoading(false)
    }
}, [size])

useEffect(() => {
    filtersRef.current = filters // Обновляем ref перед запросом
    fetchBids()
}, [size, filters, refreshTrigger])

const refreshBids = useCallback(() => {
    fetchBids(true) // Принудительное обновление с актуальными фильтрами
}, [fetchBids])

return { bids, loading, error, hasMore, setFilters, refreshTable: () => setRefreshTrigger(prev => prev + 1), refreshBids }}