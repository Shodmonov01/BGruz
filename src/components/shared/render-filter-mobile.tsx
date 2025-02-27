import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ListFilter } from 'lucide-react'
import { useBidsTableColumns } from './filter-mobile-column'
import { renderFilterInput } from '../renderFilterInput/renderFilterInput'

interface IColumn {
    accessorKey: string
    header: string
    size?: number
    searchable?: boolean
    filterType?: 'dateRange' | 'fuzzy' | 'select'
    filterOptions?: { value: string | string[]; label: string }[]
}

interface RenderFilterMobileProps {
    handleFilterChange: (columnId: string, value: any) => void
    localFilters: { [key: string]: any }
}

export function RenderFilterMobile({ handleFilterChange, localFilters }: RenderFilterMobileProps) {
    const [isOpen, setIsOpen] = useState(false)

    const originalColumns = useBidsTableColumns()

    const columns = (originalColumns as IColumn[]).map(column => ({
        id: column.accessorKey,
        columnDef: {
            filterType: column.filterType,
            filterOptions: column.filterOptions,
            header: column.header
        },
        getFilterValue: () => localFilters[column.accessorKey] || null,
        setFilterValue: (value: any) => {
            if (handleFilterChange) {
                handleFilterChange(column.accessorKey, value)
            }
        }
    }))

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
                        {columns.map((column, index) => (
                            <div key={index} className='space-y-2'>
                                {/* <label className='text-xs font-medium'>{column.columnDef.header}</label> */}
                                <div>
                                    {renderFilterInput(
                                        {
                                            ...column,
                                            getFilterValue: () => localFilters[column.id] || null
                                        },
                                        handleFilterChange
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className='flex justify-end pt-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                    Object.keys(localFilters).forEach(key => {
                                        handleFilterChange(key, null)
                                    })
                                    setIsOpen(false)
                                }}
                                className='mr-2'
                            >
                                Сбросить
                            </Button>
                            <Button size='sm' onClick={() => setIsOpen(false)}>
                                Применить
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
