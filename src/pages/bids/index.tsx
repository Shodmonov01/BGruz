import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { FilterProvider, useFilter } from '@/context/filter-context'
import { TotalsProvider } from '@/context/totals-context'

import { useGetBids } from '@/api/use-get-bids'
import { useWebSocket } from '@/api/use-websocket'

import { lazy } from 'react'

const BgruzHeader = lazy(() => import('@/components/shared/bgruz-header'))
const PageHead = lazy(() => import('@/components/shared/page-head'))
const BidsTable = lazy(() => import('./components/bids-table/bids-table'))
const BidsTableMobile = lazy(() => import('./components/bids-table/bids-table-mobile'))

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 20)
    const [isMobile, setIsMobile] = useState(false)

    const { bids, hasMore, loading, refreshBids, error } = useGetBids(size, true)
    const { setFilters } = useFilter()

    useEffect(() => {
        // Mobile detection
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        // Component mount bo'lganda ma'lumotlarni yuklaymiz
        refreshBids(true)

        return () => window.removeEventListener('resize', checkMobile)
    }, [refreshBids])

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }
    useWebSocket(refreshBids, () => {})

    return (
        <div className='px-0 md:px-4'>
            <PageHead title='Заявки' />
            <TotalsProvider data={bids}>
                <BgruzHeader />
                <FilterProvider onFiltersChange={setFilters}>
                    <div>
                        {loading && !bids ? (
                           <h1>Loading...</h1>
                        ) : error ? (
                            // @ts-expect-error надо разобраться
                            <ErrorDisplay error={error} />
                        ) : (
                            <>
                                {isMobile ? (
                                    <BidsTableMobile
                                        bids={bids || []}
                                        loadMore={() => refreshBids(true)}
                                        hasMore={hasMore}
                                        loading={loading}
                                    />
                                ) : (
                                    <BidsTable bids={bids || []} loading={loading} loadMore={loadMore} hasMore={hasMore} />
                                )}
                            </>
                        )}
                    </div>
                </FilterProvider>
            </TotalsProvider>
        </div>
    )
}
