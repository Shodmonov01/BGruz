import { useEffect, useMemo, useState } from 'react'

import { ColumnDef } from '@tanstack/react-table'


import { Eye, Trash } from 'lucide-react'


import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Orders {
    _id: string
    buyBid: {
        loadingMode: string
        cargoType: string
        loadingDate: string
        terminal1: {
            cityName: string
        }
        terminal2: {
            cityName: string
        }
        warehouses: Array<{
            cityName: string
        }>
        vehicleProfile: {
            name: string
        }
    }
    status: string
    price: number
    priceNds: number
    fullPrice: number
    fullPriceNds: number
    commission: number
    extraServicesPrice: number
    extraServicesPriceNds: number
    createdAt: string
    customer: {
        organizationName: string
    }
    ownState?: 'canceled' | string
}

interface ColumnsProps {
    isShortTable: boolean
    onApprove: (bidId: string) => void
    onDelete: (bidId: string) => void
    onOpenModal: (bid: Orders) => void
}
{/* @ts-expect-error что нибудь придумаем */}
const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
    const [timeLeft, setTimeLeft] = useState(() => {
        const time = new Date(activationTime).getTime()
        return Math.max(0, Math.floor((time - Date.now()) / 1000))
    })

    useEffect(() => {
        if (timeLeft <= 0) return
        const interval = setInterval(() => {
            setTimeLeft(prev => Math.max(prev - 1, 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [timeLeft])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return <>{timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'}</>
}

export const useOrdersTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '') // Убираем все нечисловые символы
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }
    return useMemo<ColumnDef<Orders>[]>(() => {
        const allColumns: (ColumnDef<Orders> & { isShortVersion?: boolean; searchable?: boolean })[] = [
            {
                accessorKey: '_id',
                header: 'ID',
                size: 100,
                searchable: true
            },
            {
                accessorKey: 'buyBid.cargoType',
                header: 'Вагон/Контейнер',
                size: 200,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return value === 'wagon' ? 'Вагон' : value === 'container' ? 'Контейнер' : '—'
                },
                searchable: true
            },
            {
                accessorKey: 'buyBid.loadingMode',
                header: 'Погрузка/Выгрузка',
                size: 200,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return value === 'loading' ? 'Погрузка' : value === 'unloading' ? 'Выгрузка' : '—'
                },
                searchable: true
            },
            {
                accessorKey: 'buyBid.loadingDate',
                header: 'Дата погрузки',
                size: 120,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return value ? format(new Date(String(value)), 'dd.MM.yyyy HH:mm:ss', { locale: ru }) : '—'
                },
                searchable: true
            },
            {
                accessorKey: 'buyBid.terminal1.cityName',
                header: 'Терминал 1',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'buyBid.warehouses.0.cityName',
                header: 'Склад',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'buyBid.terminal2.cityName',
                header: 'Терминал 2',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'buyBid.vehicleProfile.name',
                header: 'Профиль ТС',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'status',
                header: 'Статус',
                size: 100,
                searchable: true
            },
            {
                accessorKey: 'price',
                header: 'Моя цена',
                size: 100,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value)) // Приводим к строке перед вызовом replace
                },
                searchable: true
            },
            {
                accessorKey: 'extraServicesPrice',
                header: 'Доп услуги',
                size: 170,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value)) // Приводим к строке перед вызовом replace
                },
                searchable: true
            },
            {
                accessorKey: 'fullPrice',
                header: 'Цена + доп усл',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value)) // Приводим к строке перед вызовом replace
                },
                searchable: true
            },
            {
                accessorKey: 'commission',
                header: 'Комиссия',
                size: 100,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value)) // Приводим к строке перед вызовом replace
                },
                searchable: true
            },
            {
                accessorKey: 'fullPriceNds',
                header: 'К оплате',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value)) // Приводим к строке перед вызовом replace
                },
                searchable: true
            },
            {
                accessorKey: 'createdAt',
                header: 'Создано',
                size: 150,
                accessorFn: row => format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru }),
                searchable: true
            },
            {
                accessorKey: 'customer.organizationName',
                header: 'Клиент',
                size: 150,
                searchable: true
            },
            // {
            //     accessorKey: 'isPriceRequest',
            //     header: 'Согласовано',
            //     size: 150,
            //     cell: ({ row }) => {
            //         const isApproved = row.original.isPriceRequest
            //         return (
            //             <Button
            //                 onClick={() => onApprove(row.original._id)}
            //                 disabled={isApproved}
            //                 variant={isApproved ? 'secondary' : 'default'}
            //             >
            //                 {isApproved ? 'Согласовано' : 'Согласовать'}
            //             </Button>
            //         )
            //     },
            //     isShortVersion: true,
            //     searchable: true
            // },
            {
                header: 'Действия',
                size: 80,
                cell: ({ row }) => (
                    <div className='flex justify-center'>
                        <Eye className='mr-2 h-5 w-5 cursor-pointer' onClick={() => onOpenModal(row.original)} />
                        <Trash
                            className='mr-2 h-5 w-5 cursor-pointer text-red-500'
                            onClick={() => onDelete(row.original._id)}
                        />
                    </div>
                ),
                isShortVersion: true
            }
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
