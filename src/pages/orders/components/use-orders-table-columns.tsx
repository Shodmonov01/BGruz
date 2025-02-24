import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'


import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import loading from '../../../../public/gear-spinner.svg'
import useNumberFormatter from '@/hooks/use-format-number'



interface Bid {
    _id: string
    persistentId: string
    cargoTitle: string
    clientName: { organizationName: string }
    price: number | null
    status: string | null
    filingTime: string
    createdBy: string
    createdAt: string
    isPriceRequest?: boolean
    customerName?: { organizationName: string }
    carrier?: { organizationName: string }
    terminal1?: { cityName: string }
    terminal2?: { cityName: string }
    warehouses?: { cityName: string }[]
    vehicleProfile?: { name: string }
    loadingDate: number
    activationTime: string
    cargoType?: 'wagon' | 'container'
    loadingMode?: 'loading' | 'unloading'
    auction?: number
    bestSalePrice?: number
    extraServicesPrice?: number
    fullPrice?: number
    commission?: number
    buyBid?: {
        loadingMode: string
        cargoType: string
        loadingDate: number
        terminal1: { cityName: string }
        terminal2: { cityName: string }
        warehouses: Array<{ cityName: string }>
        vehicleProfile: { name: string }
    }
    [key: string]: unknown
}

interface ColumnsProps {
    isShortTable: boolean
    onApprove: (bidId: string) => void
    onDelete: (bidId: string) => void
    onOpenModal: (bid: any) => void
}

export const useOrdersTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {

    const { formatNumber } = useNumberFormatter()
    return useMemo<ColumnDef<Bid>[]>(() => {
        const allColumns: (ColumnDef<Bid> & {
            isShortVersion?: boolean
            searchable?: boolean
            filterType?: string
            filterOptions?: { value: string | string[]; label: string }[]
            accessorFn?: any
        })[] = [
            {
                accessorKey: '_id',
                header: 'ID',
                size: 100,
                isShortVersion: false,
                searchable: true,
                filterType: 'exact'
            },
            {
                accessorKey: 'persistentId',
                header: 'ЦМ ID',
                size: 100,
                isShortVersion: false,
                searchable: true,
                filterType: 'exact'
            },
            {
                header: 'Вагон/Конт',
                accessorKey: 'cargoType',
                size: 200,
                accessorFn: row => {
                    let cargoTypeLabel = ''
                    if (row.buyBid?.cargoType === 'wagon') {
                        cargoTypeLabel = 'Вагон'
                    } else if (row.buyBid?.cargoType === 'container') {
                        cargoTypeLabel = 'Контейнер'
                    }
                    return ` ${cargoTypeLabel}`
                },

                searchable: true,
                filterType: 'select',
                filterOptions: [
                    { value: ['wagon', 'container'], label: 'Все' },
                    { value: 'wagon', label: 'Вагон' },
                    { value: 'container', label: 'Контейнер' }
                ]
            },
            {
                accessorKey: 'loadingMode',
                header: 'Операция',
                size: 100,
                accessorFn: row => {
                    let loadingModeLabel = ''
                    if (row.loadingMode === 'loading') {
                        loadingModeLabel = 'Погрузка'
                    } else {
                        loadingModeLabel = 'Выгрузка'
                    }

                    return `${loadingModeLabel}`
                },
                searchable: true,
                filterType: 'select',
                filterOptions: [
                    { value: ['loading', 'unloading'], label: 'Все' },
                    { value: 'loading', label: 'Погрузка' },
                    { value: 'unloading', label: 'Выгрузка' }
                ]
            },
            {
                accessorKey: 'loadingDate',
                header: 'Дата подачи',
                size: 120,
                isShortVersion: true,
                searchable: true,
                accessorFn: row =>
                    row.buyBid?.loadingDate
                        ? format(new Date(row.buyBid.loadingDate), 'dd.MM.yyyy', { locale: ru })
                        : '—',
                filterType: 'dateRange'
            },

            {
                accessorKey: 'loadingTime',
                header: 'Время подачи',
                size: 120,
                searchable: true,
                // accessorFn: row => row.buyBid?.fillingTime || '—'
                accessorFn: (row: Bid) => 
                    row.buyBid && typeof row.buyBid === 'object' && 'filingTime' in row.buyBid
                        ? row.buyBid.filingTime
                        : '—'
                ,
                filterType: 'dateRange'
            },
            
            
            {
                accessorKey: 'terminal1',
                header: 'Терминал 1',
                size: 120,
                accessorFn: row => row.buyBid?.terminal1?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'warehouses',
                header: 'Склад',
                size: 120,
                accessorFn: row => row.buyBid?.warehouses?.[0]?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'terminal2',
                header: 'Терминал 2',
                isShortVersion: true,
                size: 120,
                accessorFn: row => row.buyBid?.terminal2?.cityName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'vehicleProfile',
                header: 'Профиль ТС',
                size: 150,
                accessorFn: row => row.buyBid?.vehicleProfile?.name ?? '—',
                isShortVersion: true,
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
                        cancelledByCustomer: 'Отменено клиентом',
                        new: 'Новый',
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
                isShortVersion: true,
                filterOptions: [
                    { value: ['active', 'waiting', 'executed', 'canceled'], label: 'Все' },
                    { value: ['active', 'waiting'], label: 'Акт.+ожид.' },
                    { value: 'active', label: 'Активна' },
                    { value: 'waiting', label: 'На ожидании' },
                    { value: 'executed', label: 'Выполнена' },
                    { value: 'canceled', label: 'Отменены' }
                ]
            },

            {
                accessorKey: 'price',
                header: 'Моя цена',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'extraServicesPrice',
                header: 'Доп услуги',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'fullPrice',
                header: 'Цена + доп услуги',
                size: 150,
                isShortVersion: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'commission',
                header: 'Комиссия',
                size: 100,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'fullPriceNds',
                header: 'К оплате',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'createdAt',
                header: 'Создано',
                size: 120,
                searchable: true,
                filterType: 'dateRange',
                accessorFn: (row: Bid) =>
                    row.createdAt ? format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru }) : '—'
            },

            {
                accessorKey: 'customer.fio',
                header: 'Клиент',
                size: 120,
                searchable: true,
                isShortVersion: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'customer.organizationName',
                header: 'Заказчик',
                size: 150,
                searchable: true,
                // accessorFn: row => row.customer?.organizationName ?? '—'
                accessorFn: (row: Bid) => 
                    row.customerName && typeof row.customerName === 'object' 
                        ? row.customerName.organizationName 
                        : '—'
                ,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'carrier.organizationName',
                header: 'Перевозчик',
                size: 150,
                searchable: true,
                // accessorFn: row => row.carrier?.organizationName ?? '—'
                accessorFn: (row: Bid) => 
                    row.carrier && typeof row.carrier === 'object' 
                        ? row.carrier.organizationName 
                        : '—'
                ,
                filterType: 'fuzzy'
            },
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
