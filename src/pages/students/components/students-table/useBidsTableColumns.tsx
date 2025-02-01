// // import { useMemo } from 'react'
// // import { ColumnDef } from '@tanstack/react-table'
// // import { Button } from '@/components/ui/button'
// // import { Eye, Trash } from 'lucide-react'

// // interface Bid {
// //     _id: string
// //     persistentId: string
// //     cargoTitle: string
// //     client: { organizationName: string }
// //     price: number | null
// //     status: string | null
// //     filingTime: string
// //     createdBy: string
// //     createdAt: string
// //     isPriceRequest?: boolean
// //     [key: string]: any
// // }

// // interface ColumnsProps {
// //     isShortTable: boolean
// //     onApprove: (bidId: string) => void
// //     onDelete: (bidId: string) => void
// //     onOpenModal: (bid: Bid) => void
// // }

// // interface CustomColumnDef<T> extends ColumnDef<T> {
// //     isShortVersion?: boolean
// // }


// // export const useBidsTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
// //     return useMemo<CustomColumnDef<Bid>[]>(() => {
// //         const allColumns: ColumnDef<Bid>[] = [
// //             { accessorKey: '_id', header: 'ID', size: 50, isShortVersion: true },
// //             { accessorKey: 'persistentId', header: 'ЦМ ID', size: 100, isShortVersion: true },
// //             { accessorKey: 'loadingMode', header: 'Операция', size: 150, isShortVersion: true },
// //             { accessorKey: 'filingTime', header: 'Дата погрузки', size: 150, isShortVersion: true },
// //             { accessorKey: 'terminal1.cityName', header: 'Терминал 1', size: 120, isShortVersion: true },
// //             { accessorKey: 'warehouses.0.cityName', header: 'Склад', size: 120, isShortVersion: true },
// //             { accessorKey: 'terminal2.cityName', header: 'Терминал 2', size: 120 },
// //             { accessorKey: 'vehicleProfile.name', header: 'Профиль ТС', size: 150, isShortVersion: true },
// //             { accessorKey: 'status', header: 'Статус', size: 100 },
// //             { accessorKey: 'approvedStatus', header: 'Аукцион', size: 150, isShortVersion: true },
// //             { accessorKey: 'myPrice', header: 'Моя цена', size: 100 },
// //             { accessorKey: 'bestSalePrice', header: 'Предложение', size: 120 },
// //             { accessorKey: 'extraServicesPrice', header: 'Доп услуги', size: 170 },
// //             { accessorKey: 'fullPrice', header: 'Цена + доп усл', size: 150 },
// //             { accessorKey: 'commission', header: 'Комиссия', size: 100 },
// //             { accessorKey: 'fullPriceNDS', header: 'К оплате', size: 150 },
// //             { accessorKey: 'createdAt', header: 'Создано', size: 150 },
// //             { accessorKey: 'createdBy', header: 'Создал', size: 150 },
// //             { accessorKey: 'client.organizationName', header: 'Клиент', size: 150 },
// //             { accessorKey: 'customer.name', header: 'Заказчик', size: 150 },
// //             {
// //                 accessorKey: 'isPriceRequest',
// //                 header: 'Согласовано',
// //                 size: 150,
// //                 cell: ({ row }) => {
// //                     const isApproved = row.original.isPriceRequest
// //                     return (
// //                         <Button
// //                             onClick={() => onApprove(row.original._id)}
// //                             disabled={isApproved}
// //                             variant={isApproved ? 'secondary' : 'default'}
// //                         >
// //                             {isApproved ? 'Согласовано' : 'Согласовать'}
// //                         </Button>
// //                     )
// //                 },
// //                 isShortVersion: true
// //             },
// //             {
// //                 accessorKey: '',
// //                 header: 'Действия',
// //                 size: 80,
// //                 cell: ({ row }) => (
// //                     <div className='flex'>
// //                         <Eye className='mr-2 h-5 w-5' onClick={() => onOpenModal(row.original)} />
// //                         <Trash className='mr-2 h-5 w-5 cursor-pointer text-red-500' onClick={() => onDelete(row.original._id)} />
// //                     </div>
// //                 ),
// //                 isShortVersion: true
// //             }
// //         ]
// //         return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
// //     }, [isShortTable, onApprove, onDelete, onOpenModal])
// // }


// import { useMemo } from 'react'
// import { ColumnDef } from '@tanstack/react-table'
// import { Button } from '@/components/ui/button'
// import { Eye, Trash } from 'lucide-react'

// interface Bid {
//     _id: string
//     persistentId: string
//     cargoTitle: string
//     client: { organizationName: string }
//     price: number | null
//     status: string | null
//     filingTime: string
//     createdBy: string
//     createdAt: string
//     isPriceRequest?: boolean
//     customer?: { name: string }
//     terminal1?: { cityName: string }
//     terminal2?: { cityName: string }
//     warehouses?: { cityName: string }[]
//     vehicleProfile?: { name: string }
//     [key: string]: any
// }

// interface ColumnsProps {
//     isShortTable: boolean
//     onApprove: (bidId: string) => void
//     onDelete: (bidId: string) => void
//     onOpenModal: (bid: Bid) => void
// }

// // Расширяем ColumnDef, добавляя isShortVersion
// interface CustomColumnDef<T> extends ColumnDef<T> {
//     isShortVersion?: boolean
// }

// export const useBidsTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
//     return useMemo<CustomColumnDef<Bid>[]>(() => {
//         const allColumns: CustomColumnDef<Bid>[] = [
//             { accessorKey: '_id', header: 'ID', size: 50, isShortVersion: true },
//             { accessorKey: 'persistentId', header: 'ЦМ ID', size: 100, isShortVersion: true },
//             { accessorKey: 'loadingMode', header: 'Операция', size: 150, isShortVersion: true },
//             { accessorKey: 'filingTime', header: 'Дата погрузки', size: 150, isShortVersion: true },
//             { 
//                 header: 'Терминал 1', 
//                 size: 120, 
//                 accessorFn: row => row.terminal1?.cityName ?? '—', 
//                 isShortVersion: true 
//             },
//             { 
//                 header: 'Склад', 
//                 size: 120, 
//                 accessorFn: row => row.warehouses?.[0]?.cityName ?? '—', 
//                 isShortVersion: true 
//             },
//             { 
//                 header: 'Терминал 2', 
//                 size: 120, 
//                 accessorFn: row => row.terminal2?.cityName ?? '—' 
//             },
//             { 
//                 header: 'Профиль ТС', 
//                 size: 150, 
//                 accessorFn: row => row.vehicleProfile?.name ?? '—', 
//                 isShortVersion: true 
//             },
//             { accessorKey: 'status', header: 'Статус', size: 100 },
//             { accessorKey: 'approvedStatus', header: 'Аукцион', size: 150, isShortVersion: true },
//             { accessorKey: 'myPrice', header: 'Моя цена', size: 100 },
//             { accessorKey: 'bestSalePrice', header: 'Предложение', size: 120 },
//             { accessorKey: 'extraServicesPrice', header: 'Доп услуги', size: 170 },
//             { accessorKey: 'fullPrice', header: 'Цена + доп усл', size: 150 },
//             { accessorKey: 'commission', header: 'Комиссия', size: 100 },
//             { accessorKey: 'fullPriceNDS', header: 'К оплате', size: 150 },
//             { accessorKey: 'createdAt', header: 'Создано', size: 150 },
//             { accessorKey: 'createdBy', header: 'Создал', size: 150 },
//             { 
//                 header: 'Клиент', 
//                 size: 150, 
//                 accessorFn: row => row.client?.organizationName ?? '—' 
//             },
//             { 
//                 header: 'Заказчик', 
//                 size: 150, 
//                 accessorFn: row => row.customer?.name ?? '—' 
//             },
//             {
//                 accessorKey: 'isPriceRequest',
//                 header: 'Согласовано',
//                 size: 150,
//                 cell: ({ row }) => {
//                     const isApproved = row.original.isPriceRequest
//                     return (
//                         <Button
//                             onClick={() => onApprove(row.original._id)}
//                             disabled={isApproved}
//                             variant={isApproved ? 'secondary' : 'default'}
//                         >
//                             {isApproved ? 'Согласовано' : 'Согласовать'}
//                         </Button>
//                     )
//                 },
//                 isShortVersion: true
//             },
//             {
//                 header: 'Действия',
//                 size: 80,
//                 cell: ({ row }) => (
//                     <div className='flex'>
//                         <Eye className='mr-2 h-5 w-5 cursor-pointer' onClick={() => onOpenModal(row.original)} />
//                         <Trash className='mr-2 h-5 w-5 cursor-pointer text-red-500' onClick={() => onDelete(row.original._id)} />
//                     </div>
//                 ),
//                 isShortVersion: true
//             }
//         ]
//         return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
//     }, [isShortTable, onApprove, onDelete, onOpenModal])
// }


import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Trash } from 'lucide-react'

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
    [key: string]: any
}

interface ColumnsProps {
    isShortTable: boolean
    onApprove: (bidId: string) => void
    onDelete: (bidId: string) => void
    onOpenModal: (bid: Bid) => void
}

export const useBidsTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal }: ColumnsProps) => {
    return useMemo<ColumnDef<Bid>[]>(() => {
        const allColumns: (ColumnDef<Bid> & { isShortVersion?: boolean })[] = [
            { accessorKey: '_id', header: 'ID', size: 50, isShortVersion: true },
            { accessorKey: 'persistentId', header: 'ЦМ ID', size: 100, isShortVersion: true },
            { accessorKey: 'loadingMode', header: 'Операция', size: 150, isShortVersion: true },
            { accessorKey: 'filingTime', header: 'Дата погрузки', size: 150, isShortVersion: true },
            { 
                header: 'Терминал 1', 
                size: 120, 
                accessorFn: row => row.terminal1?.cityName ?? '—', 
                isShortVersion: true 
            },
            { 
                header: 'Склад', 
                size: 120, 
                accessorFn: row => row.warehouses?.[0]?.cityName ?? '—', 
                isShortVersion: true 
            },
            { 
                header: 'Терминал 2', 
                size: 120, 
                accessorFn: row => row.terminal2?.cityName ?? '—' 
            },
            { 
                header: 'Профиль ТС', 
                size: 150, 
                accessorFn: row => row.vehicleProfile?.name ?? '—', 
                isShortVersion: true 
            },
            { accessorKey: 'status', header: 'Статус', size: 100 },
            { accessorKey: 'approvedStatus', header: 'Аукцион', size: 150, isShortVersion: true },
            { accessorKey: 'myPrice', header: 'Моя цена', size: 100 },
            { accessorKey: 'bestSalePrice', header: 'Предложение', size: 120 },
            { accessorKey: 'extraServicesPrice', header: 'Доп услуги', size: 170 },
            { accessorKey: 'fullPrice', header: 'Цена + доп усл', size: 150 },
            { accessorKey: 'commission', header: 'Комиссия', size: 100 },
            { accessorKey: 'fullPriceNDS', header: 'К оплате', size: 150 },
            { accessorKey: 'createdAt', header: 'Создано', size: 150 },
            { accessorKey: 'createdBy', header: 'Создал', size: 150 },
            { 
                header: 'Клиент', 
                size: 150, 
                accessorFn: row => row.client?.organizationName ?? '—' 
            },
            { 
                header: 'Заказчик', 
                size: 150, 
                accessorFn: row => row.customer?.name ?? '—' 
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
                isShortVersion: true
            },
            {
                header: 'Действия',
                size: 80,
                cell: ({ row }) => (
                    <div className='flex'>
                        <Eye className='mr-2 h-5 w-5 cursor-pointer' onClick={() => onOpenModal(row.original)} />
                        <Trash className='mr-2 h-5 w-5 cursor-pointer text-red-500' onClick={() => onDelete(row.original._id)} />
                    </div>
                ),
                isShortVersion: true
            }
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
