import { useMemo} from 'react'

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


// const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
//     const [timeLeft, setTimeLeft] = useState(() => {
//         const time = new Date(activationTime).getTime()
//         return Math.max(0, Math.floor((time - Date.now()) / 1000))
//     })

//     useEffect(() => {
//         if (timeLeft <= 0) return
//         const interval = setInterval(() => {
//             setTimeLeft(prev => Math.max(prev - 1, 0))
//         }, 1000)
//         return () => clearInterval(interval)
//     }, [timeLeft])

//     const minutes = Math.floor(timeLeft / 60)
//     const seconds = timeLeft % 60
//     return <>{timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'}</>
// }

export const useOrdersTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '') // Убираем все нечисловые символы
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }

    return useMemo<ColumnDef<Orders>[]>(() => {
        const allColumns: (ColumnDef<Orders> & { isShortVersion?: boolean; searchable?: boolean })[] = [
            {
                accessorKey: '_id',
                header: 'Операция',
                size: 100,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'buyBid.loadingDate',
                header: 'Дата погрузки',
                size: 120,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return value ? format(new Date(String(value)), 'dd.MM.yyyy HH:mm:ss', { locale: ru }) : '—'
                },
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'buyBid.terminal1.cityName',
                header: 'Терминал 1',
                size: 120,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'buyBid.warehouses[0].cityName',
                header: 'Склад',
                size: 120,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'buyBid.terminal2.cityName',
                header: 'Терминал 2',
                size: 120,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'buyBid.vehicleProfile.name',
                header: 'Профиль ТС',
                size: 150,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'status',
                header: 'Статус',
                size: 100,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'documentOrderItems',
                header: 'Документы',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    if (value && value[0].DateCreate) {
                        const date = new Date(value[0].DateCreate)
                        return date.toISOString().split('T')[0]
                    }
                    return 'Нет'
                },
                searchable: true
            },
            {
                accessorKey: 'price',
                header: 'Цена перевозки',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true
            },
            {
                accessorKey: 'fullPrice',
                header: 'Цена + услуги',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true
            },
            {
                accessorKey: 'commission',
                header: 'Комиссия',
                size: 100,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true
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
                isShortVersion: true
            },
            {
                accessorKey: 'assignedDriver.fio',
                header: 'Водитель',
                size: 120,
                searchable: true,
                isShortVersion: true
            },
            {
                accessorKey: 'assignedVehicle.plateNum',
                header: '№ машины',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'assignedTrailer.plateNum',
                header: '№ прицепа',
                size: 120,
                searchable: true
            },
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
