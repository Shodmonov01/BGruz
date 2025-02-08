// import PageHead from '@/components/shared/page-head'
// import { useSearchParams } from 'react-router-dom'
// import PopupModal from '@/components/shared/popup-modal'
// import { useGetBids } from '@/hooks/useGetBids'
// import StudentCreateForm from './components/student-forms/student-create-form'
// import { useMemo } from 'react'
// import BidsTableMobile from './components/bidsTableMobile'
// import BidsTable from './components/BidsTable'
// import CurrentTime from '@/components/shared/сurrent-time'
// import { Button } from '@/components/ui/button'

// export default function BidsPage() {
//     const [searchParams] = useSearchParams()
//     const page = Number(searchParams.get('page') || 1)
//     const pageLimit = Number(searchParams.get('limit') || 10)
//     const offset = (page - 1) * pageLimit
//     const filters = useMemo(() => ({}), []) // Используем memo для фильтров

//     const { bids, loading, error } = useGetBids(offset, pageLimit, filters)

//     if (loading) return <p>Загрузка...</p>
//     if (error) return <p>Ошибка загрузки данных: {error}</p>

//     return (
//         <div className='p-4 md:p-8'>
//             <PageHead title='Заявки' />

//             <div className='flex items-center justify-between gap-2 pb-5'>
//                 {/* <div className='flex flex-1 gap-4'>
//                     <TableSearchInput placeholder='Поиск' />
//                 </div> */}
//                 <div className=''>
//                     <CurrentTime />
//                 </div>
//                 <div className='flex flex-wrap gap-5 '>
//                     <Button>Загрузить</Button>
//                     <Button>Отменить</Button>
//                     <Button>Заявки</Button>
//                 </div>
//                 <div className='flex gap-3 '>
//                     <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
//                 </div>
//             </div>

//             <div>
//                 <div className='hidden md:block'>
//                     <BidsTable bids={bids || []} />
//                 </div>

//                 <div>
//                     <div className='md:hidden'>
//                         <BidsTableMobile bids={bids || []} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import PageHead from '@/components/shared/page-head'
import { useSearchParams } from 'react-router-dom'
import PopupModal from '@/components/shared/popup-modal'
import StudentCreateForm from './components/student-forms/student-create-form'
import { useMemo, useState } from 'react'
import BidsTableMobile from './components/bidsTableMobile'
import BidsTable from './components/BidsTable'
import CurrentTime from '@/components/shared/сurrent-time'
import { Button } from '@/components/ui/button'
import { useGetBids } from '@/hooks/useGetBids'

export default function BidsPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 5) 
    const filters = useMemo(() => ({}), []) 
    {/* @ts-expect-error Пока не знаю что делать */}
    const { bids, loading, error, hasMore } = useGetBids(size, filters)

    
    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 5) 
        }
    }

    if (loading && size === 5) return <p>Загрузка...</p> // Только при первой загрузке
    if (error) return <p>Ошибка загрузки данных: {error}</p>

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
                    {/* @ts-expect-error Пока не знаю что делать */}

                    <BidsTable bids={bids || []} />
                </div>

                <div className='md:hidden'>
                    <BidsTableMobile bids={bids || []} />
                </div>
            </div>
        </div>
    )
}
