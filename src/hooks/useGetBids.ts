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

export const useGetBids = (offset: number, limit: number, filters: BidFilter) => {
    const [bids, setBids] = useState<Bid[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBids = async () => {
            setLoading(true)
            setError(null)

            try {
                const token = localStorage.getItem('authToken') || ''
                const response = await postData2<{ items: Bid[] }>(
                    'api/v1/bids/getbatch',
                    {
                        startFrom: { value: '', fieldName: '' },
                        filter: filters,
                        sort: { fieldName: 'createdAt', order: 'descending' }
                    },
                    token
                )

                console.log('Ответ от API:', response.items)
                setBids(response.items)
            } catch (err) {
                console.error('Ошибка при загрузке заявок:', err)
                setError('Не удалось загрузить заявки. Попробуйте позже.')
            } finally {
                setLoading(false)
            }
        }

        fetchBids()
    }, [offset, limit, filters])

    return { bids, loading, error }
}
