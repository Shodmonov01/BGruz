import { useCallback, useEffect, useRef, useState } from 'react'
import { postData2 } from '@/api/api'
import { useFilter } from '@/context/filter-context'

interface OrderFilter {
    number?: number
    clientId?: number
    status?: string[]
    clientName?: string
}

interface Orders {
    persistentId: string
    cargoTitle: string
    clientId: number
    price: number
    status: string | null
    startDate: string
    client: { organizationName: string }
    terminal1: { cityName: string; address: string }
    terminal2: { cityName: string; address: string }
}

export const useGetOrders = (size: number) => {
    const [orders, setOrders] = useState<Orders[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [_, setFilters] = useState<OrderFilter>({})
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
    const { filters } = useFilter()


    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         setLoading(true)
    //         setError(null)

    //         try {
    //             const token = localStorage.getItem('authToken') || ''
    //             const response = await postData2<{ items: Orders[]; total: number }>(
    //                 'api/v1/orders/getbatch',
    //                 {
    //                     size,
    //                     filter: filters
    //                 },
    //                 token
    //             )

    //             setOrders(response.items)
    //             setHasMore(response.items.length < response.total) // Проверяем, есть ли ещё данные
    //         } catch (err) {
    //             console.error('Ошибка при загрузке заявок:', err)
    //             setError('Не удалось загрузить заявки. Попробуйте позже.')
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchOrders()
    // }, [size, filters, refreshTrigger])

    const prevFiltersRef = useRef<OrderFilter>({})

    const filtersRef = useRef<OrderFilter>({})

    
const fetchOrders = useCallback(async (force = false) => {
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

        const response = await postData2<{ items: Orders[]; total: number }>(
            'api/v1/orders/getbatch',
            { size, filter: currentFilters },
            token
        )

        setOrders(response.items)
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
    fetchOrders()
}, [size, filters, refreshTrigger])

const refreshOrders = useCallback(() => {
    fetchOrders(true) // Принудительное обновление с актуальными фильтрами
}, [fetchOrders])

    return { orders, loading, error, setFilters, hasMore, refreshTable: () => setRefreshTrigger(prev => prev + 1), refreshOrders }
}
