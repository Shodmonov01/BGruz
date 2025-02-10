import PageHead from '@/components/shared/page-head'
import { useSearchParams } from 'react-router-dom'
import PopupModal from '@/components/shared/popup-modal'
import StudentCreateForm from './components/bid-forms/bid-create-form'
import { useEffect, useRef, useState } from 'react'
import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'
import CurrentTime from '@/components/shared/сurrent-time'
import { Button } from '@/components/ui/button'
import { useGetBids } from '@/hooks/useGetBids'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 5)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { bids, hasMore, loading, setFilters, refreshTable } = useGetBids(size)

    const handleFilterChange = (columnId: string, value: string) => {
        const newFilters = { ...localFilters }
        if (value) newFilters[columnId] = value
        else delete newFilters[columnId]

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
            setSize(prev => prev + 5)
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

    // if (loading && size === 5) return <p>Загрузка...</p> // Только при первой загрузке
    // if (error) return <p>Ошибка загрузки данных: {error}</p>

    return (
        <div className='p-4 md:p-8'>
            <PageHead title='Заявки' />

            <div className='flex items-center justify-between gap-2 pb-5'>
                <div>
                    <CurrentTime />
                </div>
                <div className='flex flex-wrap gap-5 '>
                    <Button onClick={loadMore} disabled={!hasMore}>
                        {hasMore ? 'Загрузить ещё' : 'Все данные загружены'}
                    </Button>
                    <Button>Отменить</Button>
                    <Button>Заявки</Button>
                </div>
                <div className='flex gap-3 '>
                    <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
                </div>
            </div>

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
