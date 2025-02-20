import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Trash } from 'lucide-react'
import loading from '../../../../../public/gear-spinner.svg'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useServerTime } from '@/lib/ServerTimeContext'

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
    fullPriceNDS?: number
    [key: string]: unknown
}

interface ColumnsProps {
    isShortTable: boolean
    onApprove: (bidId: string) => void
    onDelete: (bidId: string) => void
    onOpenModal: (bid: Bid) => void
}

// const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
//     const [timeLeft, setTimeLeft] = useState<number>(0);
//     const initialFetchDone = useRef(false);

//     useEffect(() => {
//         const fetchTime = async () => {
//             try {
//                 const token = localStorage.getItem("authToken");
//                 const res = await fetchPrivateData("api/v1/time/now", token);

//                 let serverTime = new Date(res.current_time).getTime();
//                 let targetTime = new Date(activationTime).getTime();

//                 // ⬇ Добавляем 5 часов
//                 targetTime += 5 * 60 * 60 * 1000;

//                 // console.log("✅ Server Time (ISO):", new Date(serverTime).toISOString());
//                 // console.log("🎯 Target Time (ISO):", new Date(targetTime).toISOString());

//                 const initialTimeLeft = Math.max(0, Math.floor((targetTime - serverTime) / 1000));
//                 // console.log("⏳ Initial time left (s):", initialTimeLeft);

//                 setTimeLeft(initialTimeLeft);
//                 initialFetchDone.current = true;
//             } catch (error) {
//                 console.error("❌ Error fetching time:", error);
//             }
//         };

//         if (!initialFetchDone.current) {
//             fetchTime();
//         }

//         const interval = setInterval(() => {
//             setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [activationTime]);

//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;

//     return timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, "0")}` : "Время вышло";
// };

// export default AuctionTimer;

const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
    const serverTime = useServerTime() // Берем серверное время из контекста
    const [timeLeft, setTimeLeft] = useState<number>(0)

    useEffect(() => {
        if (!serverTime) return // Ждем, пока контекст загрузит серверное время

        let targetTime = new Date(activationTime).getTime()
        targetTime += 5 * 60 * 60 * 1000 // Добавляем 5 часов

        const initialTimeLeft = Math.max(0, Math.floor((targetTime - serverTime) / 1000))
        setTimeLeft(initialTimeLeft)

        const interval = setInterval(() => {
            setTimeLeft(prevTime => Math.max(0, prevTime - 1))
        }, 1000)

        return () => clearInterval(interval)
    }, [serverTime, activationTime])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'
}

export default AuctionTimer

export const useBidsTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '')
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }

    return useMemo<ColumnDef<Bid>[]>(() => {
        const allColumns: (ColumnDef<Bid> & {
            isShortVersion?: boolean
            searchable?: boolean
            filterType?: string
            filterOptions?: { value: string | string[]; label: string }[]
            accessorFn?: any
        })[] = [
            {
                accessorKey: 'number',
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
                header: 'Вагон/Контейнер',
                accessorKey: 'cargoType',
                size: 200,
                accessorFn: row => {
                    let cargoTypeLabel = ''
                    if (row.cargoType === 'wagon') {
                        cargoTypeLabel = 'Вагон'
                    } else if (row.cargoType === 'container') {
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
                header: 'Погрузка/Выгрузка',
                accessorKey: 'loadingMode',
                size: 200,
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
                    row.loadingDate ? format(new Date(row.loadingDate), 'dd.MM.yyyy', { locale: ru }) : '',
                filterType: 'dateRange'
            },
            {
                accessorKey: 'terminal1',
                header: 'Терминал 1',
                size: 120,
                accessorFn: row => row.terminal1?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'warehouses',
                header: 'Склад',
                size: 120,
                accessorFn: row => row.warehouses?.[0]?.cityName ?? '—',
                isShortVersion: true,
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
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                header: 'Аукцион',
                size: 140,
                accessorKey: 'activationTime',
                cell: ({ row }) => {
                    // console.log('Activation Time:', row.original.activationTime)
                    return <AuctionTimer activationTime={row.original.activationTime} />
                },
                isShortVersion: true,
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
            },
            {
                accessorKey: 'price',
                header: 'Моя цена',
                size: 100,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                accessorKey: 'bestSalePrice',
                header: 'Предложение',
                size: 120,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                accessorKey: 'extraServicesPrice',
                header: 'Доп услуги',
                size: 170,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                header: 'Цена + доп усл',
                size: 150,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            { accessorKey: 'commission', header: 'Комиссия', size: 100, searchable: true, filterType: 'range' },
            {
                accessorKey: 'fullPriceNDS',
                header: 'К оплате',
                size: 150,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                size: 150,
                accessorFn: row => format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru }),
                searchable: true,
                filterType: 'dateRange'
            },
            { accessorKey: 'createdBy', header: 'Создал', size: 150, searchable: true, filterType: 'fuzzy' },
            {
                accessorKey: 'clientName',
                header: 'Клиент',
                size: 150,
                accessorFn: row => row.client?.organizationName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'customerName',
                header: 'Заказчик',
                size: 150,
                accessorFn: row => row.customer?.organizationName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'isPriceRequest',
                header: 'Согласовано',
                size: 150,
                // cell: ({ row }) => {
                //     const isApproved = row.original.isPriceRequest
                //     return (
                //         <Button
                //             onClick={() => onApprove(row.original._id)}
                //             disabled={isApproved}
                //             variant={isApproved ? 'secondary' : 'default'}
                //         >
                //             {isApproved ? 'Согласовано' : 'Согласовать'}
                //         </Button>
                //     )
                // },
                cell: ({ row }) => {
                    return <Button onClick={() => onApprove(row.original._id)}>Согласовать</Button>
                },
                isShortVersion: true
                // searchable: true,
                // filterType: null,
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
                )
                // isShortVersion: true,
                // filterType: null,
            }
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
