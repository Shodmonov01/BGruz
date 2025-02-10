import { useEffect, useState } from 'react'
import { postData2 } from '@/api/api'

interface BidFilter {
    number?: number
    clientId?: number
    status?: string[]
    clientName?: string
}

interface Bid {
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

export const useGetBids = (size: number, ) => {
    const [bids, setBids] = useState<Bid[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [filters, setFilters] = useState<BidFilter>({})
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)


    useEffect(() => {
        const fetchBids = async () => {
            setLoading(true)
            setError(null)

            try {
                const token = localStorage.getItem('authToken') || ''
                const response = await postData2<{ items: Bid[]; total: number }>(
                    'api/v1/bids/getbatch',
                    {
                        size,
                        filter: filters,
                        
                    },
                    token
                )

                console.log('Ответ от API:', response.items)
                setBids(response.items)
                setHasMore(response.items.length < response.total) // Проверяем, есть ли ещё данные
            } catch (err) {
                console.error('Ошибка при загрузке заявок:', err)
                setError('Не удалось загрузить заявки. Попробуйте позже.')
            } finally {
                setLoading(false)
            }
        }

        fetchBids()
    }, [size, filters, refreshTrigger])

    // return { bids, loading, error, hasMore, setFilters}
    return { bids, loading, error, setFilters, hasMore, refreshTable: () => setRefreshTrigger(prev => prev + 1) }

}
