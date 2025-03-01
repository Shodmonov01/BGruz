import { useState, useEffect, useRef, useCallback } from 'react'
import BgruzHeader from '@/components/shared/bgruz-header'
import OrdersTable from './components/orders-table'
import { useSearchParams } from 'react-router-dom'
import OrderTableMobile from './components/orders-table-mobile'
import { useWebSocket } from '@/api/use-websocket'
import { useGetOrders } from '@/api/use-get-orders'
import { TotalsProvider } from '@/context/totals-context'

export default function OrderPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 500)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { orders, hasMore, loading, setFilters, refreshTable, refreshOrders } = useGetOrders(size)

    const handleFilterChange = useCallback(
        (columnId: string, value: any) => {
            let formattedValue = value

            if (columnId === 'loadingMode' || columnId === 'cargoType' || columnId === 'status') {
                formattedValue = Array.isArray(value) ? value : [value]
            } else if ((columnId === 'loadingDate' || columnId === 'createdAt') && value) {
                formattedValue = {
                    start: new Date(value.from.setHours(23, 59, 59, 999)).toISOString(),
                    end: new Date(value.to.setHours(23, 59, 59, 999)).toISOString()
                }
            } else if (['number', 'fullPrice', 'comission', 'extraServicesPrice'].includes(columnId)) {
                formattedValue = Number(value)
            }

            const newFilters = {
                ...localFilters,
                [columnId]: formattedValue
            }

            setLocalFilters(newFilters)
            setFilters(newFilters)

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(async () => {
                const filterPayload = {
                    filter: {
                        ...newFilters
                    },
                    sort: {
                        filterFieldName: 'createdAt',
                        direction: 'descending'
                    },
                    size: size
                }

                try {
                    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                    const token = localStorage.getItem('authToken') || ''
                    const response = await fetch(`${API_BASE_URL}/api/v1/orders/getbatch`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(filterPayload)
                    })

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    await response.json()
                    refreshTable()
                } catch (error) {
                    console.error('Error in filter change:', error)
                }
            }, 500)
        },
        [localFilters, size, refreshTable]
    )

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }


    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                if (hasMore && !loading) {
                    loadMore()
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hasMore, loading])

    useWebSocket(() => {}, refreshOrders);


    return (
        <div className='p-4'>
            <TotalsProvider data={orders}>
                <BgruzHeader />
                <div className='hidden md:block'>
                    <OrdersTable
                        orders={orders || []}
                        setFilters={setFilters}
                        handleFilterChange={handleFilterChange}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        loading={loading}
                        localFilters={localFilters}
                    />
                </div>
                <div className='md:hidden'>
                    <OrderTableMobile orders={orders || []} />
                </div>
            </TotalsProvider>
        </div>
    )
}
