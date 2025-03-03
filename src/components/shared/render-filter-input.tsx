// // import { Input } from '../ui/input'
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// // import { DateRangePicker } from '@/pages/bids/components/bid-form-detail/rangePicker'

// // export function renderFilterInput(column, handleFilterChange, pageType) {
// //     const filterType = column.columnDef.filterType
// //     const filterOptions = column.columnDef.filterOptions

// //     const getDefaultValue = columnId => {
// //         if (pageType === 'orders') {
// //             switch (columnId) {
// //                 case 'cargoType':
// //                     return ['bulk', 'liquid']
// //                 case 'status':
// //                     return [
// //                         'new',
// //                         'inTransit',
// //                         'completed',
// //                         'failing',
// //                         'failed',
// //                         'canceledByCustomer',
// //                         'canceledByCarrier',
// //                         'canceledByCustomerWithPenalty',
// //                         'canceledByCarrierWithPenalty',
// //                         'canceled',
// //                         'headingToLoading',
// //                         'loading',
// //                         'unloading',
// //                         'delivered'
// //                     ]
// //                 case 'loadingMode':
// //                     return ['pickup', 'delivery']
// //                 default:
// //                     return []
// //             }
// //         } else {
// //             switch (columnId) {
// //                 case 'cargoType':
// //                     return ['wagon', 'container']
// //                 case 'status':
// //                     return ['active', 'waiting']
// //                 case 'loadingMode':
// //                     return ['loading', 'unloading']
// //                 default:
// //                     return []
// //             }
// //         }
// //     }

// //     const initializeFilter = () => {
// //         const currentValue = column.getFilterValue()
// //         if (!currentValue) {
// //             const defaultValue = getDefaultValue(column.id)
// //             if (defaultValue.length > 0) {
// //                 column.setFilterValue(defaultValue)
// //                 handleFilterChange(column.id, defaultValue)
// //             }
// //         }
// //     }

// //     initializeFilter()

// //     const handleChange = value => {
// //         column.setFilterValue(value)
// //         handleFilterChange(column.id, value)
// //     }

// //     const getStringValue = (value: string | string[] | null): string => {
// //         if (Array.isArray(value)) {
// //             return value.join(',')
// //         }
// //         return value ?? ''
// //     }

// //     switch (filterType) {
// //         case 'exact':
// //             return (
// //                 <Input
// //                     value={(column.getFilterValue() as string) ?? ''}
// //                     onChange={e => handleChange(e.target.value)}
// //                     placeholder='Точное совпадение'
// //                     className='text-xs min-w-16 h-7 bg-white'
// //                 />
// //             )
// //         case 'select':
// //             return (
// //                 <Select
// //                     value={getStringValue(column.getFilterValue())}
// //                     onValueChange={value => {
// //                         const selectedOption = filterOptions?.find(option =>
// //                             Array.isArray(option.value) ? option.value.join(',') === value : option.value === value
// //                         )
// //                         const newValue = selectedOption ? selectedOption.value : getDefaultValue(column.id)
// //                         column.setFilterValue(newValue)
// //                         handleFilterChange(column.id, newValue)
// //                     }}
// //                 >
// //                     <SelectTrigger className='text-xs min-w-full h-7 bg-white'>
// //                         <SelectValue placeholder='Выберите' />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                         {filterOptions?.map(option => (
// //                             <SelectItem
// //                                 key={Array.isArray(option.value) ? option.value.join(',') : option.value}
// //                                 value={Array.isArray(option.value) ? option.value.join(',') : option.value}
// //                             >
// //                                 {option.label}
// //                             </SelectItem>
// //                         ))}
// //                     </SelectContent>
// //                 </Select>
// //             )
// //         case 'dateRange':
// //             return (
// //                 <DateRangePicker
// //                     value={column.getFilterValue() as { from: Date; to?: Date } | undefined}
// //                     onChange={range => handleChange(range)}
// //                     placeholder='Выберите даты'
// //                     className='text-xs'
// //                 />
// //             )
// //         case 'fuzzy':
// //             return (
// //                 <Input
// //                     value={(column.getFilterValue() as string) ?? ''}
// //                     onChange={e => handleChange(e.target.value)}
// //                     placeholder='Поиск...'
// //                     className='text-xs h-7 min-w-16 bg-white'
// //                 />
// //             )
// //         case 'range':
// //             return <button className='text-xs h-7 bg-white px-2'>{column.columnDef.header}</button>
// //         default:
// //             return null
// //     }
// // }

// import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/pages/bids/components/bid-form-detail/rangePicker'
import { useFilter } from '@/context/filter-context'

// export function FilterInput({ column, handleFilterChange, pageType }) {
export function FilterInput({ column, handleFilterChange }) {
    const { pageType } = useFilter() // Берём pageType из контекста

    const getDefaultValue = columnId => {
        if (pageType === 'orders') {
            switch (columnId) {
                case 'cargoType':
                    return ['wagon', 'container']
                case 'status':
                    return [
                        'new',
                        'inTransit',
                        'completed',
                        'failing',
                        'failed',
                        'canceledByCustomer',
                        'canceledByCarrier',
                        'canceledByCustomerWithPenalty',
                        'canceledByCarrierWithPenalty',
                        'headingToLoading',
                        'loading',
                        'unloading',
                        'delivered'
                    ]
                case 'loadingMode':
                    return ['loading', 'unloading']
                default:
                    return []
            }
        } else if (pageType === 'bids') {
            switch (columnId) {
                case 'cargoType':
                    return ['wagon', 'container']
                case 'status':
                    return ['active', 'waiting']
                case 'loadingMode':
                    return ['loading', 'unloading']
                default:
                    return []
            }
        }
        return []
    }

    useEffect(() => {
        const currentValue = column.getFilterValue()
        if (!currentValue) {
            const defaultValue = getDefaultValue(column.id)
            console.log(`Setting default value for ${column.id}:`, defaultValue)
            if (defaultValue.length > 0) {
                column.setFilterValue(defaultValue)
                handleFilterChange(column.id, defaultValue)
            }
        }
    }, [column, handleFilterChange, pageType]) // Теперь следим за pageType

    // Обработчик изменения фильтра
    const handleChange = value => {
        column.setFilterValue(value)
        handleFilterChange(column.id, value)
    }

    // Преобразование значения фильтра для строки
    const getStringValue = (value: string | string[] | null): string => {
        if (Array.isArray(value)) {
            return value.join(',')
        }
        return value ?? ''
    }

    switch (column.columnDef.filterType) {
        case 'exact':
            return (
                <Input
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={e => handleChange(e.target.value)}
                    placeholder='Точное совпадение'
                    className='text-xs min-w-16 h-7 bg-white'
                />
            )
        case 'select':
            return (
                // <Select
                //     value={column.getFilterValue()}
                //     onValueChange={value => handleChange(value)}
                // >
                //     <SelectTrigger>
                //         <SelectValue placeholder='Выберите' />
                //     </SelectTrigger>
                //     <SelectContent>
                //         {column.columnDef.filterOptions?.map(option => (
                //             <SelectItem key={option.value} value={option.value}>
                //                 {option.label}
                //             </SelectItem>
                //         ))}
                //     </SelectContent>
                // </Select>
                <Select value={getStringValue(column.getFilterValue())} onValueChange={value => handleChange(value)}>
                    <SelectTrigger className='text-xs min-w-full h-7 bg-white'>
                        <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                        {column.columnDef.filterOptions?.map(option => (
                            <SelectItem
                                key={Array.isArray(option.value) ? option.value.join(',') : option.value}
                                value={Array.isArray(option.value) ? option.value.join(',') : option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case 'dateRange':
            return (
                <DateRangePicker
                    value={column.getFilterValue() as { from: Date; to?: Date } | undefined}
                    onChange={range => handleChange(range)}
                    placeholder='Дата'
                    className='text-xs'
                />
            )
        case 'fuzzy':
            return (
                <Input
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={e => handleChange(e.target.value)}
                    placeholder='Поиск...'
                    className='text-xs h-7 min-w-16 bg-white'
                />
            )
        case 'range':
            return <button className='text-xs h-7 bg-white px-2'>{column.columnDef.header}</button>
        default:
            return null
    }
}

import { useEffect } from 'react'
