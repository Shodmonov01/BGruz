// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { useLocation, useSearchParams } from 'react-router-dom'

// import { useBidsTableColumns } from '@/pages/bids/components/bids-table/useBidsTableColumns'

// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Button } from '@/components/ui/button'

// import { useFilter } from '@/context/filter-context'
// import { useGetBids } from '@/api/use-get-bids'

// import { FilterInput } from './render-filter-input'
// import { ListFilter } from 'lucide-react'
// import { useOrdersTableColumns } from '@/pages/orders/components/use-orders-table-columns'
// import { useGetOrders } from '@/api/use-get-orders'



// export function RenderFilterMobile() {
//     const location = useLocation()
//     const [isOpen, setIsOpen] = useState<boolean>(false)
//     const [searchParams] = useSearchParams()
//     const size = useMemo(() => Number(searchParams.get('size')) || 200, [searchParams])
//     const { filters, handleFilterChange } = useFilter()
//     const [localFilters, setLocalFilters] = useState(filters)

//     useEffect(() => {
//         setLocalFilters(filters)
//     }, [filters])

//     const pageType = useMemo(() => (location.pathname.includes('/orders') ? 'orders' : 'bids'), [location.pathname]);


    

//     const { loading: loadingBids, refreshBids, setFilters: setBidsFilters } = useGetBids(size)

//     const { loading: loadingOrders, refreshOrders, setFilters: setOrdersFilters } = useGetOrders(size)

//     const loading = pageType === 'orders' ? loadingOrders : loadingBids


//     const setFilters = pageType === 'orders' ? setOrdersFilters : setBidsFilters
//     const refreshData = pageType === 'orders' ? refreshOrders : refreshBids


//     const applyFilters = useCallback(() => {
//         Object.entries(localFilters).forEach(([key, value]) => {
//             if (handleFilterChange) {
//                 handleFilterChange(key, value)
//             }
//         })

//         refreshData()
//         setIsOpen(false)
//     }, [localFilters, refreshData, handleFilterChange])

//     const resetFilters = useCallback(() => {
//         const emptyFilters = {}
//         setLocalFilters(emptyFilters)
//         setFilters(emptyFilters)
//         refreshData()
//         setIsOpen(false)
//     }, [setFilters, refreshData])

//     // Вызываем хуки колонок
//     const ordersColumns = useOrdersTableColumns({
//         onApprove: applyFilters,
//         isMobile: true,
//         isShortTable: false,
//         onDelete: () => {},
//         onOpenModal: () => {}
//     })

//     const bidsColumns = useBidsTableColumns({
//         onApprove: applyFilters,
//         isMobile: true
//     })

//     // Выбираем нужные колонки
//     const originalColumns = pageType === 'orders' ? ordersColumns : bidsColumns

//     const memoizedColumns = useMemo(() => {
//         return originalColumns
//         // @ts-ignore
//             .filter(column => column.isMobile === true)
//             .map(column => ({
//                 // @ts-ignore
//                 id: column.accessorKey,
//                 columnDef: {
//                     // @ts-ignore
//                     filterType: column.filterType,
//                     // @ts-ignore 
//                     filterOptions: column.filterOptions,
//                     header: column.header
//                 },
//                 // @ts-ignore
//                 getFilterValue: () => localFilters[column.accessorKey] || null,
//                 setFilterValue: (value: any) => {
//                     setLocalFilters(prev => ({
//                         ...prev,
//                         // @ts-ignore
//                         [column.accessorKey]: value
//                     }))
//                 }
//             }))
//     }, [originalColumns, localFilters])

//     return (
//         <div className='ml-2'>
//             <Popover open={isOpen} onOpenChange={setIsOpen}>
//                 <PopoverTrigger asChild>
//                     <Button variant='outline' size='icon' className='relative'>
//                         <ListFilter className='h-[1.2rem] w-[1.2rem]' />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className='p-4 w-72'>
//                     <div className='space-y-4'>
//                         {memoizedColumns.map(column => (
//                             <div key={column.id} className='space-y-2'>
//                                 {/* @ts-ignore */}
//                                 <label className='text-xs font-medium'>{column.columnDef.header}</label>
//                                 <div>
//                                     <FilterInput
//                                         column={column}
//                                         handleFilterChange={handleFilterChange}
//                                         pageType={pageType}
//                                     />
//                                 </div>
//                             </div>
//                         ))}

//                         <div className='flex justify-end pt-2'>
//                             <Button variant='outline' size='sm' onClick={resetFilters} className='mr-2'>
//                                 Сбросить
//                             </Button>
//                             <Button size='sm' onClick={applyFilters} disabled={loading}>
//                                 {loading ? 'Загрузка...' : 'Применить'}
//                             </Button>
//                         </div>
//                     </div>
//                 </PopoverContent>
//             </Popover>
//         </div>
//     )
// }


import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useBidsTableColumns } from '@/pages/bids/components/bids-table/useBidsTableColumns'
import { useOrdersTableColumns } from '@/pages/orders/components/use-orders-table-columns'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import { useFilter } from '@/context/filter-context'
import { useGetBids } from '@/api/use-get-bids'
import { useGetOrders } from '@/api/use-get-orders'

import { FilterInput } from './render-filter-input'
import { ListFilter } from 'lucide-react'

export function RenderFilterMobile() {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const size = useMemo(() => Number(searchParams.get('size')) || 200, [searchParams])
    const { filters, handleFilterChange } = useFilter()
    const [localFilters, setLocalFilters] = useState(filters)

    const isMounted = useRef(false)
    const prevFiltersRef = useRef(filters)

    // Проверка, является ли устройство мобильным
    const isMobile = useMemo(() => window.innerWidth <= 768, [])

    // Определение типа страницы (orders или bids)
    const pageType = useMemo(() => {
        if (location.pathname.includes('/orders')) return 'orders'
        if (location.pathname.includes('/bids')) return 'bids'
        return null
    }, [location.pathname])

    const { loading: loadingBids, refreshBids } = useGetBids(size)
    const { loading: loadingOrders, refreshOrders } = useGetOrders(size)

    const loading = pageType === 'orders' ? loadingOrders : loadingBids
    const refreshData = pageType === 'orders' ? refreshOrders : refreshBids

    useEffect(() => {
        if (isMounted.current) {
            if (JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current)) {
                // Только если фильтры изменились
                setLocalFilters(filters)
                prevFiltersRef.current = filters
            }
        } else {
            isMounted.current = true
        }
    }, [filters])

    // Применение фильтров
    const applyFilters = useCallback(() => {
        // Применяем локальные фильтры
        Object.entries(localFilters).forEach(([key, value]) => {
            if (handleFilterChange) {
                handleFilterChange(key, value)
            }
        })
        refreshData()
        setIsOpen(false)
    }, [localFilters, refreshData, handleFilterChange])

    // Сброс фильтров
    const resetFilters = useCallback(() => {
        const emptyFilters = {}
        setLocalFilters(emptyFilters)
        refreshData()
        setIsOpen(false)
    }, [refreshData])

    // Хуки для колонок таблицы
    const ordersColumns = useOrdersTableColumns({
        onApprove: applyFilters,
        isMobile: true,
        isShortTable: false,
        onDelete: () => {},
        onOpenModal: () => {}
    })

    const bidsColumns = useBidsTableColumns({
        onApprove: applyFilters,
        isMobile: true
    })

    // Выбор нужных колонок
    const originalColumns = pageType === 'orders' ? ordersColumns : bidsColumns

    const memoizedColumns = useMemo(() => {
        return originalColumns
        // @ts-ignore
            .filter(column => column.isMobile === true)
            .map(column => ({
                // @ts-ignore
                id: column.accessorKey,
                columnDef: {
                    // @ts-ignore
                    filterType: column.filterType,
                    // @ts-ignore 
                    filterOptions: column.filterOptions,
                    header: column.header
                },
                // @ts-ignore
                getFilterValue: () => localFilters[column.accessorKey] || null,
                setFilterValue: (value: any) => {
                    setLocalFilters(prev => ({
                        ...prev,
                        // @ts-ignore
                        [column.accessorKey]: value
                    }))
                }
            }))
    }, [originalColumns, localFilters])

    // Не выполняем запросы, если не мобильная версия
    if (!isMobile) return null

    return (
        <div className='ml-2'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant='outline' size='icon' className='relative'>
                        <ListFilter className='h-[1.2rem] w-[1.2rem]' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='p-4 w-72'>
                    <div className='space-y-4'>
                        {memoizedColumns.map(column => (
                            <div key={column.id} className='space-y-2'>
                                {/* @ts-ignore */}
                                <label className='text-xs font-medium'>{column.columnDef.header}</label>
                                <div>
                                    <FilterInput
                                        column={column}
                                        handleFilterChange={handleFilterChange}
                                        pageType={pageType}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className='flex justify-end pt-2'>
                            <Button variant='outline' size='sm' onClick={resetFilters} className='mr-2'>
                                Сбросить
                            </Button>
                            <Button size='sm' onClick={applyFilters} disabled={loading}>
                                {loading ? 'Загрузка...' : 'Применить'}
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
