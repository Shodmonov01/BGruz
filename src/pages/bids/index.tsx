import { useCallback, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import BgruzHeader from '@/components/shared/bgruz-header'
import PageHead from '@/components/shared/page-head'

import { useGetBids } from '@/hooks/useGetBids'

import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'
import { postData2 } from '@/api/api'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 50)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string | any[] }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { bids, hasMore, loading, setFilters, refreshTable } = useGetBids(size)
    console.log('localFilters', localFilters)

    const handleFilterChange = useCallback(
        (columnId: string, value: any | any[]) => {
            const newFilters = {
                ...localFilters,
                [columnId]: value ? [value] : []
            }
            console.log('newFilters', newFilters)

            setLocalFilters(newFilters)

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                const filterPayload = {
                    filter: {
                        cargoType: [newFilters.cargoType] || [],
                        loadingMode: [newFilters.loadingMode] || []
                    },
                    sort: {
                        filterFieldName: 'createdAt',
                        direction: 'descending'
                    },
                    size: size
                }

                try {
                    const token = localStorage.getItem('authToken') || ''
                    postData2('/api/v1/bids/getbatch', filterPayload, token)
                    refreshTable()
                } catch (error) {
                    console.log(error)
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

    return (
        <div className='py-4 md:px-4'>
            <PageHead title='Заявки' />

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
                    <BidsTableMobile bids={bids || []} />
                </div>
            </div>
        </div>
    )
}
