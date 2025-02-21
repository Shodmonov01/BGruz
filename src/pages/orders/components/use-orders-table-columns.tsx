import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import { Eye, Trash } from 'lucide-react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import loading from '../../../../public/gear-spinner.svg'
import useNumberFormatter from '@/hooks/use-format-number'

// interface Orders {
//     _id: string
//     buyBid: {
//         loadingMode: string
//         cargoType: string
//         loadingDate: string
//         terminal1: {
//             cityName: string
//         }
//         terminal2: {
//             cityName: string
//         }
//         warehouses: Array<{
//             cityName: string
//         }>
//         vehicleProfile: {
//             name: string
//         }
//     }
//     status: string
//     price: number
//     priceNds: number
//     fullPrice: number
//     fullPriceNds: number
//     commission: number
//     extraServicesPrice: number
//     extraServicesPriceNds: number
//     createdAt: string
//     customer: {
//         organizationName: string
//     }
//     ownState?: 'canceled' | string
// }

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
    // const formatNumber = (value: string) => {
    //     const num = value.replace(/\D/g, '') // Убираем все нечисловые символы
    //     return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    // }
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

                isShortVersion: true,
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
                isShortVersion: true,
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
                header: 'Дата погрузки',
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
                accessorKey: 'loadingDate',
                header: 'Время погрузки',
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
                filterOptions: [
                    { value: ['active', 'waiting', 'executed', 'canceled'], label: 'Все' },
                    { value: ['active', 'waiting'], label: 'Акт.+ожид.' },
                    { value: 'active', label: 'Активна' },
                    { value: 'waiting', label: 'На ожидании' },
                    { value: 'executed', label: 'Выполнена' },
                    { value: 'canceled', label: 'Отменены' }
                ]
            },
            // {
            //     accessorKey: 'documentOrderItems',
            //     header: 'Документы',
            //     size: 150,
            //     cell: ({ getValue }) => {
            //         const value = getValue()
            //         if (value && value[0].DateCreate) {
            //             const date = new Date(value[0].DateCreate)
            //             return date.toISOString().split('T')[0]
            //         }
            //         return 'Нет'
            //     },
            //     searchable: true
            // },
            // {
            //     accessorKey: 'price',
            //     header: 'Цена перевозки',
            //     size: 150,
            //     cell: ({ getValue }) => {
            //         const value = getValue()
            //         return formatNumber(String(value))
            //     },
            //     searchable: true
            // },
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
            // {
            //     accessorKey: 'fullPrice',
            //     header: 'Цена + услуги',
            //     size: 150,
            //     cell: ({ getValue }) => {
            //         const value = getValue()
            //         return formatNumber(String(value))
            //     },
            //     searchable: true
            // },
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
                isShortVersion: true,
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
            // {
            //     accessorKey: 'assignedDriver.fio',
            //     header: 'Водитель',
            //     size: 120,
            //     searchable: true,
            //     isShortVersion: true
            // },
            // {
            //     accessorKey: 'assignedVehicle.plateNum',
            //     header: '№ машины',
            //     size: 120,
            //     searchable: true
            // },
            // {
            //     accessorKey: 'assignedTrailer.plateNum',
            //     header: '№ прицепа',
            //     size: 120,
            //     searchable: true
            // },

            {
                accessorKey: 'customer.fio',
                header: 'Клиент',
                size: 120,
                searchable: true,
                filterType: 'fuzzy'
            },
            // {
            //     accessorKey: '',
            //     header: 'Предложения',
            //     size: 120,
            //     searchable: true
            // },
            {
                accessorKey: 'customer.organizationName',
                header: 'Заказчик',
                size: 150,
                isShortVersion: true,
                searchable: true,
                accessorFn: row => row.customer?.organizationName ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'carrier.organizationName',
                header: 'Перевозчик',
                size: 150,
                searchable: true,
                accessorFn: row => row.carrier?.organizationName ?? '—',
                filterType: 'fuzzy'
            },
            // {
            //     accessorKey: 'createdAtDate',
            //     header: 'Дата создания',
            //     size: 120,
            //     searchable: true,
            //     accessorFn: (row: Bid) =>
            //         row.createdAt ? format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru }) : '—'
            // },
            // {
            //     accessorKey: 'statusUpdated',
            //     header: 'Дата статуса',
            //     size: 120,
            //     searchable: true,
            //     accessorFn: (row: Bid) =>
            //         row.statusUpdated ? format(new Date(row.statusUpdated), 'dd.MM.yyyy HH:mm', { locale: ru }) : '—',
            //     filterType: 'dateRange'
            // },
            // {
            //     accessorKey: '',
            //     header: 'Бухгалтер',
            //     size: 120,
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
