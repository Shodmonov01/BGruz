import PageHead from '@/components/shared/page-head'
import { useSearchParams } from 'react-router-dom'
import TableSearchInput from '@/components/shared/table-search-input'
import PopupModal from '@/components/shared/popup-modal'
import { useGetBids } from '@/hooks/useGetBids'
import StudentCreateForm from './components/student-forms/student-create-form'
import { useMemo } from 'react'
import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const page = Number(searchParams.get('page') || 1)
    const pageLimit = Number(searchParams.get('limit') || 10)
    const offset = (page - 1) * pageLimit
    const filters = useMemo(() => ({}), []) // Используем memo для фильтров

    const { bids, loading, error } = useGetBids(offset, pageLimit, filters)

    if (loading) return <p>Загрузка...</p>
    if (error) return <p>Ошибка загрузки данных: {error}</p>

    return (
        <div className='p-4 md:p-8'>
            <PageHead title='Заявки' />

            <div className='flex items-center justify-between gap-2 py-5'>
                <div className='flex flex-1 gap-4'>
                    <TableSearchInput placeholder='Поиск' />
                </div>
                <div className='flex gap-3 '>
                    <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
                </div>
            </div>
            <div>
                <div className='hidden md:block'>
                    <BidsTable bids={bids || []} />
                </div>

                <div>
                    <div className='md:hidden'>
                        <BidsTableMobile bids={bids || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
