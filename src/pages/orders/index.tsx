import { useState } from 'react'
import BgruzHeader from '@/components/shared/bgruz-header'
import OrdersTable from './components/orders-table'
import { useSearchParams } from 'react-router-dom'
import OrderTableMobile from './components/orders-table-mobile'
import { useWebSocket } from '@/api/use-websocket'
import { useGetOrders } from '@/api/use-get-orders'
import { TotalsProvider } from '@/context/totals-context'
import PageHead from '@/components/shared/page-head'
import { FilterProvider, useFilter } from '@/context/filter-context'

export default function OrderPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 500)
    const { orders, hasMore, loading,  refreshOrders } = useGetOrders(size)
    const { setFilters } = useFilter()

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }
      
    useWebSocket(() => {}, refreshOrders);


    return (
        <div className='p-4'>
            <PageHead title='Заказы' />
            <TotalsProvider data={orders}>
                <BgruzHeader />
                <FilterProvider pageType="orders" onFiltersChange={setFilters}>

                <div className='hidden md:block'>
                    {/* @ts-expect-error надо что то сделать */}
                    <OrdersTable
                        orders={orders || []}
                        setFilters={setFilters}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        loading={loading}
                    />
                </div>
                <div className='md:hidden'>
                    <OrderTableMobile orders={orders || []} />
                </div>
                </FilterProvider>
            </TotalsProvider>
        </div>
    )
}
