import { useEffect, useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Trash } from 'lucide-react'
import loading from '../../../../../public/gear-spinner.svg'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Bid {
    _id: string
    persistentId: string
    cargoTitle: string
    client: { organizationName: string }
    price: number | null
    status: string | null
    filingTime: string
    createdBy: string
    createdAt: string
    isPriceRequest?: boolean
    customer?: { name: string }
    terminal1?: { cityName: string }
    terminal2?: { cityName: string }
    warehouses?: { cityName: string }[]
    vehicleProfile?: { name: string }
    [key: string]: unknown
}

interface ColumnsProps {
    isShortTable: boolean
    onApprove: (bidId: string) => void
    onDelete: (bidId: string) => void
    onOpenModal: (bid: Bid) => void
}

export const useBidsTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
    return useMemo<ColumnDef<Bid>[]>(() => {
        const allColumns: (ColumnDef<Bid> & { isShortVersion?: boolean; searchable?: boolean })[] = [
            { accessorKey: 'number', header: 'ID', size: 100, isShortVersion: true, searchable: true },
            { accessorKey: 'persistentId', header: 'ЦМ ID', size: 100, isShortVersion: true, searchable: true },
            {
                header: 'Операция',
                size: 200,
                accessorFn: row => {
                    let loadingModeLabel = ''
                    if (row.loadingMode === 'loading') {
                        loadingModeLabel = 'Погрузка'
                    } else if (row.loadingMode === 'unloading') {
                        loadingModeLabel = 'Выгрузка'
                    }

                    let cargoTypeLabel = ''
                    if (row.cargoType === 'wagon') {
                        cargoTypeLabel = 'Вагон'
                    } else if (row.cargoType === 'container') {
                        cargoTypeLabel = 'Контейнер'
                    }

                    return `${loadingModeLabel} | ${cargoTypeLabel}`
                },
                isShortVersion: true,
                searchable: true
            },
            { accessorKey: 'filingTime', header: 'Дата погрузки', size: 120, isShortVersion: true, searchable: true },
            {
                header: 'Терминал 1',
                size: 120,
                accessorFn: row => row.terminal1?.cityName ?? '—',
                isShortVersion: true,
                searchable: true
            },
            {
                header: 'Склад',
                size: 120,
                accessorFn: row => row.warehouses?.[0]?.cityName ?? '—',
                isShortVersion: true,
                searchable: true
            },
            {
                header: 'Терминал 2',
                size: 120,
                accessorFn: row => row.terminal2?.cityName ?? '—',
                searchable: true
            },
            {
                header: 'Профиль ТС',
                size: 150,
                accessorFn: row => row.vehicleProfile?.name ?? '—',
                isShortVersion: true,
                searchable: true
            },
            // {
            //     header: 'Время активации',
            //     size: 150,
            //     accessorFn: row => row.activationDelay ?? '—',
            //     isShortVersion: true,
            //     searchable: true
            // }
            {
                header: 'Время активации',
                size: 140,
                accessorKey: 'activationDelay',
                cell: ({ row }) => {
                                            {/* @ts-expect-error Пока не знаю что делать */}

                    const [timeLeft, setTimeLeft] = useState(row.original.activationDelay ? row.original.activationDelay * 60 : 0)
                    //@ts-ignore
                    useEffect(() => {
                        if (timeLeft <= 0) return
                        const interval = setInterval(() => {
                            setTimeLeft(prev => Math.max(prev - 1, 0))
                        }, 1000)
                        return () => clearInterval(interval)
                    }, [timeLeft])

                    const minutes = Math.floor(timeLeft / 60)
                    const seconds = timeLeft % 60
                    return timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '—'
                },
                isShortVersion: true,
                searchable: true
            },
            {
                header: 'Статус',
                size: 100,
                accessorFn: row => row.status ?? null, // Оставляем только данные
                cell: ({ row }) => 
                    row.original.status 
                        ? row.original.status 
                        : <div><img src={loading} alt="Загрузка..." /></div>,
                searchable: true
            },
            { accessorKey: 'approvedStatus', header: 'Аукцион', size: 150, isShortVersion: true, searchable: true },
            { accessorKey: 'price', header: 'Моя цена', size: 100, searchable: true },
            { accessorKey: 'bestSalePrice', header: 'Предложение', size: 120, searchable: true },
            { accessorKey: 'extraServicesPrice', header: 'Доп услуги', size: 170, searchable: true },
            { accessorKey: 'fullPrice', header: 'Цена + доп усл', size: 150, searchable: true },
            { accessorKey: 'commission', header: 'Комиссия', size: 100, searchable: true },
            { accessorKey: 'fullPriceNDS', header: 'К оплате', size: 150, searchable: true },
            {
                accessorKey: 'createdAt',
                header: 'Создано',
                size: 150,
                accessorFn: row => format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru }),
                searchable: true
            },

            { accessorKey: 'createdBy', header: 'Создал', size: 150, searchable: true },
            {
                header: 'Клиент',
                size: 150,
                accessorFn: row => row.client?.organizationName ?? '—',
                searchable: true
            },
            {
                header: 'Заказчик',
                size: 150,
                accessorFn: row => row.customer?.name ?? '—',
                searchable: true
            },
            {
                accessorKey: 'isPriceRequest',
                header: 'Согласовано',
                size: 150,
                cell: ({ row }) => {
                    const isApproved = row.original.isPriceRequest
                    return (
                        <Button
                            onClick={() => onApprove(row.original._id)}
                            disabled={isApproved}
                            variant={isApproved ? 'secondary' : 'default'}
                        >
                            {isApproved ? 'Согласовано' : 'Согласовать'}
                        </Button>
                    )
                },
                isShortVersion: true,
                searchable: true
            },
            {
                header: 'Действия',
                size: 80,
                cell: ({ row }) => (
                    <div className='flex'>
                        <Eye className='mr-2 h-5 w-5 cursor-pointer' onClick={() => onOpenModal(row.original)} />
                        <Trash
                            className='mr-2 h-5 w-5 cursor-pointer text-red-500'
                            onClick={() => onDelete(row.original._id)}
                        />
                    </div>
                ),
                isShortVersion: true,
                searchable: true
            }
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
