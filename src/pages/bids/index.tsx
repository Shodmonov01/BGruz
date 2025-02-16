import { useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import BgruzHeader from '@/components/shared/bgruz-header'
import PageHead from '@/components/shared/page-head'

import { useGetBids } from '@/hooks/useGetBids'

import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'

interface DateRange {
    from: Date
    to: Date
}

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 50)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { bids, hasMore, loading, setFilters, refreshTable } = useGetBids(size)

    const handleFilterChange = (columnId: string, value: string | DateRange | null) => {
        const newFilters = { ...localFilters }
        if (value) {
            if (typeof value === 'string') {
                newFilters[columnId] = value
            } else if (value.from && value.to) {
                newFilters[columnId] = `${value.from.toISOString()},${value.to.toISOString()}`
            }
        } else {
            delete newFilters[columnId]
        }

        setLocalFilters(newFilters)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            console.log('Обновляем фильтры:', newFilters)
            setFilters(newFilters)
            refreshTable()
        }, 500)
    }

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
                    />
                </div>

                <div className='md:hidden'>
                    <BidsTableMobile bids={bids || []} />
                </div>
            </div>
        </div>
    )
}
