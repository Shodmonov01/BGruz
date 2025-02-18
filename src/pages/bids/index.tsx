import { useCallback, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import BgruzHeader from '@/components/shared/bgruz-header'
import PageHead from '@/components/shared/page-head'

import { useGetBids } from '@/hooks/useGetBids'

import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 100)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { bids, hasMore, loading, setFilters, refreshTable } = useGetBids(size)

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
                    const token = localStorage.getItem('authToken') || ''
                    const response = await fetch('https://portal.bgruz.com/api/v1/bids/getbatch', {
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

    console.log('localFilters', localFilters)
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
