import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ListFilter } from 'lucide-react'
import { useGetBids } from '@/api/use-get-bids'
import { useFilter } from '@/context/filter-context'
import { useSearchParams } from 'react-router-dom'
import { useBidsTableColumns } from '@/pages/bids/components/bids-table/useBidsTableColumns'
import { FilterInput } from './render-filter-input'

interface IColumn {
    accessorKey: string
    header: string
    size?: number
    searchable?: boolean
    filterType?: 'dateRange' | 'fuzzy' | 'select'
    filterOptions?: { value: string | string[]; label: string }[]
    isMobile: boolean
}

// interface FilterColumn {
//     id: string
//     columnDef: {
//         filterType?: 'dateRange' | 'fuzzy' | 'select'
//         filterOptions?: { value: string | string[]; label: string }[]
//         header: string
//     }
//     getFilterValue: () => any
//     setFilterValue: (value: any) => void
// }

export function RenderFilterMobile() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const size = useMemo(() => Number(searchParams.get('size')) || 200, [searchParams])
    const { loading, refreshBids, setFilters } = useGetBids(size)
    const { filters, handleFilterChange } = useFilter()
    const [localFilters, setLocalFilters] = useState(filters)

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    // const handleLocalFilterChange = useCallback((key: string, value: any) => {
    //     setLocalFilters(prev => ({
    //         ...prev,
    //         [key]: value
    //     }))
    // }, [])

    const applyFilters = useCallback(() => {
        Object.entries(localFilters).forEach(([key, value]) => {
            if (handleFilterChange) {
                handleFilterChange(key, value)
            }
        })

        // setFilters(localFilters)
        refreshBids()
        setIsOpen(false)
    }, [localFilters, setFilters, handleFilterChange])

    const resetFilters = useCallback(() => {
        const emptyFilters = {}
        setLocalFilters(emptyFilters)
        setFilters(emptyFilters)
        refreshBids()
        setIsOpen(false)
    }, [setFilters, refreshBids])

    const originalColumns = useBidsTableColumns({
        onApprove: applyFilters,
        isMobile: true
    })

    const memoizedColumns = useMemo(() => {
        return (originalColumns as IColumn[])
            .filter(column => column.isMobile === true)
            .map(column => ({
                id: column.accessorKey,
                columnDef: {
                    filterType: column.filterType,
                    filterOptions: column.filterOptions,
                    header: column.header
                },
                getFilterValue: () => localFilters[column.accessorKey] || null,
                setFilterValue: (value: any) => {
                    setLocalFilters(prev => ({
                        ...prev,
                        [column.accessorKey]: value
                    }))
                }
            }))
    }, [originalColumns, localFilters])

    return (
        <div className='ml-2'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant='outline' size='icon' className='relative'>
                        <ListFilter className='h-[1.2rem] w-[1.2rem]' />
                        {/* {hasActiveFilters && (
                            <span className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary'></span>
                        )} */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='p-4 w-72'>
                    <div className='space-y-4'>
                        {memoizedColumns.map((column, index) => (
                            <div key={column.id} className='space-y-2'>
                                <label className='text-xs font-medium'>{column.columnDef.header}</label>
                                {/* <div>{renderFilterInput(column, handleFilterChange)}</div> */}
                                <div>
                                {/* @ts-ignore */}
                                    <FilterInput
                                        column={column}
                                        handleFilterChange={handleFilterChange}
                                        // pageType='orders'
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
