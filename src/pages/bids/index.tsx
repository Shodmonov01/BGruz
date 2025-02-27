import { useCallback, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import BgruzHeader from '@/components/shared/bgruz-header'
import PageHead from '@/components/shared/page-head'


import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'
import { useGetBids } from '@/api/use-get-bids'
import { useWebSocket } from '@/api/use-websocket'
import { TotalsProvider } from '@/context/totals-context'


export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 200)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { bids, hasMore, loading, setFilters, refreshBids } = useGetBids(size)

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

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                setLocalFilters(newFilters)
                setFilters(newFilters)
            }, 500)
        },
        [localFilters, setFilters]
    )

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }

    useWebSocket(refreshBids, () => {});
    
    return (
        <div className='py-4 md:px-4'>
            <PageHead title='Заявки' />
            <TotalsProvider data={bids}>
                <BgruzHeader />

                <div>
                    <div className='hidden md:block'>
                        <BidsTable
                            bids={bids || []}
                            setFilters={setFilters}
                            handleFilterChange={handleFilterChange}
                            loadMore={loadMore}
                            hasMore={hasMore}
                            loading={loading}
                            localFilters={localFilters}
                        />
                    </div>

                    <div className='md:hidden'>
                        {/* @ts-ignore */}
                        <BidsTableMobile bids={bids || []} />
                    </div>
                </div>
            </TotalsProvider>
        </div>
    )
}
