import { useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import BgruzHeader from '@/components/shared/bgruz-header'
import PageHead from '@/components/shared/page-head'

import BidsTable from './components/BidsTable'
import { useGetBids } from '@/api/use-get-bids'
import { useWebSocket } from '@/api/use-websocket'
import { TotalsProvider } from '@/context/totals-context'
import { FilterProvider, useFilter } from '@/context/filter-context'
import BidsTableMobile from './components/bidsTableMobile'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 500)

    const { bids, hasMore, loading, refreshBids } = useGetBids(size)
    const { setFilters } = useFilter()

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }

    useWebSocket(refreshBids, () => {})

    return (
        <div className='py-4 md:px-4'>
            <PageHead title='Заявки' />
            <TotalsProvider data={bids}>
                <BgruzHeader />
                <FilterProvider onFiltersChange={setFilters}>
                    <div>
                        <div className='hidden md:block'>
                            <BidsTable bids={bids || []} loading={loading} loadMore={loadMore} hasMore={hasMore} />
                        </div>

                        <div className='md:hidden'>
                            <BidsTableMobile bids={bids || []} />
                        </div>
                    </div>
                </FilterProvider>
            </TotalsProvider>
        </div>
    )
}
