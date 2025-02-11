import PageHead from '@/components/shared/page-head'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'
import CurrentTime from '@/components/shared/сurrent-time'
import { useGetBids } from '@/hooks/useGetBids'
import logo from '../../../public/logoRb.png'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 50)
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

    // if (loading && size === 5) return <p>Загрузка...</p> // Только при первой загрузке
    // if (error) return <p>Ошибка загрузки данных: {error}</p>

    return (
        <div className='py-4 md:px-8'>
            <PageHead title='Заявки' />

            <div className='hidden md:flex items-start justify-between gap-2 pb-5'>
                <div className='flex gap-1 justify-center items-center'>
                    <img src={logo} alt='logo' className='h-10' />
                    <span className='text-[#03B4E0]'>Биржа</span>
                    <span className=''>Грузоверевозок</span>
                </div>
                <div>
                    <CurrentTime />
                </div>
                
                <div>
                    <ul className='text-[14px]'>
                        <li>
                            Сумма заявок: <span>10 000 000</span>
                        </li>
                        <li>
                            Комиссия: <span>500 000</span>
                        </li>
                        <li>
                            К оплате: <span>9 500 000</span>
                        </li>
                        <li>
                            и НДС: <span>1 900 000</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <p>Амир Шодмонов</p>
                    <p>admin@mail.com</p>
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
