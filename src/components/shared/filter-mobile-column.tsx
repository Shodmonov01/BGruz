import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import loading from '../../../public/gear-spinner.svg'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Bid } from '@/types'

export const FilterMobileColumns = () => {
    // const formatNumber = (value: string) => {
    //     const num = value.replace(/\D/g, '')
    //     return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    // }

    return useMemo<ColumnDef<Bid>[]>(() => {
        const allColumns: (ColumnDef<Bid> & {
            searchable?: boolean
            filterType?: string
            filterOptions?: { value: string | string[]; label: string }[]
            accessorFn?: any
        })[] = [
            {
                accessorKey: 'loadingDate',
                header: 'Дата погрузки',
                size: 120,
                searchable: true,
                accessorFn: row =>
                    row.loadingDate ? format(new Date(row.loadingDate), 'dd.MM.yyyy', { locale: ru }) : '',
                filterType: 'dateRange'
            },
            {
                accessorKey: 'terminal1',
                header: 'Терминал 1',
                size: 120,
                accessorFn: row => row.terminal1?.cityName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'terminal2',
                header: 'Терминал 2',
                size: 120,
                accessorFn: row => row.terminal2?.cityName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'vehicleProfile',
                header: 'Профиль ТС',
                size: 150,
                accessorFn: row => row.vehicleProfile?.name ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'status',
                header: 'Статус',
                size: 100,
                accessorFn: row => row.status ?? null,
                cell: ({ row }) => {
                    const statusMap = {
                        active: 'Активна',
                        waiting: 'На ожидании',
                        executed: 'Выполнена',
                        canceled: 'Отменена'
                    }

                    const status = row.original.status

                    return status ? (
                        <span>{statusMap[status] || status}</span>
                    ) : (
                        <div className='flex items-center justify-center'>
                            <img src={loading || '/placeholder.svg'} alt='Загрузка...' />
                        </div>
                    )
                },
                searchable: true,
                filterType: 'select',
                filterOptions: [
                    { value: ['active', 'waiting', 'executed', 'canceled'], label: 'Все' },
                    { value: ['active', 'waiting'], label: 'Акт.+ожид.' },
                    { value: 'active', label: 'Активна' },
                    { value: 'waiting', label: 'На ожидании' },
                    { value: 'executed', label: 'Выполнена' },
                    { value: 'canceled', label: 'Отменены' }
                ]
            }
        ]
        console.log('allColumns', allColumns)

        return allColumns
    }, [])
}
