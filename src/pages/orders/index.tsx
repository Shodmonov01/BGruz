import { useState, useEffect } from 'react'
import BgruzHeader from '@/components/shared/bgruz-header'
import OrdersTable from './components/orders-table'
import { useSearchParams } from 'react-router-dom'
import OrderTableMobile from './components/orders-table-mobile'
import { useWebSocket } from '@/api/use-websocket'
import { useGetOrders } from '@/api/use-get-orders'
import { TotalsProvider } from '@/context/totals-context'
import PageHead from '@/components/shared/page-head'
import { useFilter } from '@/context/filter-context'

export default function OrderPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 500)
    // const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    // const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { orders, hasMore, loading,  refreshOrders } = useGetOrders(size)
    const { setFilters } = useFilter()

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

    useEffect(() => {
        setFilters({});  // Очистить фильтры при загрузке страницы
      }, [setFilters]);

      
    useWebSocket(() => {}, refreshOrders);


    return (
        <div className='p-4'>
            <PageHead title='Заказы' />
            <TotalsProvider data={orders}>
                <BgruzHeader />
                <div className='hidden md:block'>
                    {/* @ts-ignore */}
                    <OrdersTable
                        orders={orders || []}
                        setFilters={setFilters}
                        // handleFilterChange={handleFilterChange}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        loading={loading}
                        // localFilters={localFilters}
                    />
                </div>
                <div className='md:hidden'>
                    <OrderTableMobile orders={orders || []} />
                </div>
            </TotalsProvider>
        </div>
    )
}
