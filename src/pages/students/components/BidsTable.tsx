// import { useMemo, useState } from 'react'
// import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
// import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Modal } from '@/components/ui/modal'
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
// import { deleteData, postData2 } from '@/api/api'
// import { Eye, Trash } from 'lucide-react'

// interface Bid {
//     persistentId: string
//     cargoTitle: string
//     client: { organizationName: string }
//     price: number | null
//     status: string | null
//     filingTime: string
//     createdBy: string
//     createdAt: string
// }

// function BidsTable({ bids }) {
//     //@ts-ignore
//     const [filters, setFilters] = useState<{ [key: string]: string }>({})
//     const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
//     const [isModalOpen, setIsModalOpen] = useState(false)

//     const handleOpenModal = (bid: Bid) => {
//         setSelectedBid(bid)
//         setIsModalOpen(true)
//     }

//     const columns = useMemo<ColumnDef<Bid>[]>(
//         () => [
//             {
//                 accessorKey: '_id',
//                 header: 'ID',
//                 size: 50, // Устанавливаем ширину колонки в пикселях
//                 searchable: true
//             },
//             {
//                 accessorKey: 'persistentId',
//                 header: 'ЦМ ID',
//                 size: 100,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'loadingMode',
//                 header: 'Операция',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'filingTime',
//                 header: 'Дата погрузки',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'terminal1.cityName',
//                 header: 'Терминал 1',
//                 size: 120,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'warehouses.0.cityName',
//                 header: 'Склад',
//                 size: 120,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'terminal2.cityName',
//                 header: 'Терминал 2',
//                 size: 120,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'vehicleProfile.name',
//                 header: 'Профиль ТС',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'status',
//                 header: 'Статус',
//                 size: 100,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'approvedStatus',
//                 header: 'Аукцион',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'myPrice',
//                 header: 'Моя цена',
//                 size: 100,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'bestSalePrice',
//                 header: 'Предложение',
//                 size: 120,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'isPriceRequest',
//                 header: 'Согласовано',
//                 size: 150,
//                 cell: ({ row }) => {
//                     const isApproved = row.original.isPriceRequest
//                     console.log(isApproved);

//                     return (
//                         <Button
//                             onClick={() => handleApprove(row.original)}
//                             disabled={isApproved}
//                             variant={isApproved ? 'secondary' : 'default'}
//                         >
//                             {isApproved ? 'Согласовано' : 'Согласовать'}
//                         </Button>
//                     )
//                 },
//                 searchable: true
//             },
//             {
//                 accessorKey: 'extraServicesPrice',
//                 header: 'Доп услуги',
//                 size: 170,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'fullPrice',
//                 header: 'Цена + доп усл',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'commission',
//                 header: 'Комиссия',
//                 size: 100,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'fullPriceNDS',
//                 header: 'К оплате',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'createdAt',
//                 header: 'Создано',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'createdBy',
//                 header: 'Создал',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'client.organizationName',
//                 header: 'Клиент',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: 'customer.name',
//                 header: 'Заказчик',
//                 size: 150,
//                 searchable: true
//             },
//             {
//                 accessorKey: '',
//                 header: 'Действия',
//                 size: 80,
//                 cell: ({ row }) => {
//                     return (
//                         <div className='flex'>
//                             <Eye className='mr-2 h-5 w-5' onClick={() => handleOpenModal(row.original)} />
//                             <Trash
//                                 className='mr-2 h-5 w-5 cursor-pointer text-red-500'
//                                 onClick={() => handleDelete(row.original._id)}
//                             />
//                         </div>
//                     )
//                 }
//             }
//         ],
//         []
//     )

//     const handleApprove = async (bid: Bid) => {
//         try {
//             const token = localStorage.getItem('authToken')
//             await postData2(`/api/v1/bids/${bid._id}/approve`, token)
//             console.log(`Заявка ${bid.persistentId} одобрена`)
//         } catch (error) {
//             console.error('Ошибка при отправке запроса:', error)
//         }
//         console.log(`Аукцион для заявки с ID ${bid.persistentId}`)
//     }

//     const handleDelete = async (bidId: string) => {
//         if (!confirm(`Вы уверены, что хотите удалить заявку ${bidId}?`)) return

//         try {
//             const token = localStorage.getItem('authToken')
//             await deleteData(`api/v1/bids/${bidId}`, token)
//             console.log(`Заявка ${bidId} удалена`)
//         } catch (error) {
//             console.error('Ошибка при удалении заявки:', error)
//         }
//     }

//     const table = useReactTable({
//         data: bids,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         state: { columnFilters: Object.entries(filters).map(([id, value]) => ({ id, value })) }
//     })

//     return (
//         <div>
//             <ScrollArea className='max-h-[1200px] w-full overflow-auto h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-80px)]'>
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map(headerGroup => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map(header => (
//                                     <TableHead key={header.id}>
//                                         <div className={`w-[${header.column.columnDef.size}px] `}>
//                                             <div className='mb-4'>
//                                                 {flexRender(header.column.columnDef.header, header.getContext())}
//                                             </div>

//                                             <div>
//                                                 {header.column.columnDef.searchable && (
//                                                     <Input
//                                                         value={filters[header.column.id] || ''}
//                                                         placeholder='Поиск...'
//                                                         className='mt-1 text-xs'
//                                                     />
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </TableHead>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {table.getRowModel().rows.map(row => (
//                             <TableRow
//                                 key={row.id}

//                                 onDoubleClick={() => handleOpenModal(bid)}
//                             >
//                                 {row.getVisibleCells().map(cell => (
//                                     <TableCell key={cell.id}>
//                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//                 <ScrollBar orientation='horizontal' />
//             </ScrollArea>
//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 {selectedBid && (
//                     <div className='p-6'>
//                         <h2 className='text-lg font-bold'>{selectedBid.cargoTitle}</h2>
//                         <p>Клиент: {selectedBid.client.organizationName}</p>
//                         <p>Статус: {selectedBid.status || '—'}</p>
//                         <p>Цена: {selectedBid.price || '—'}</p>
//                         <Button onClick={() => setIsModalOpen(false)}>Закрыть</Button>
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     )
// }

// export default BidsTable

import { useMemo, useState, useCallback } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, TableOptions } from '@tanstack/react-table'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { deleteData, postData2 } from '@/api/api'
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
    [key: string]: any // Для поддержки произвольных ключей
}

// interface BidsTableProps {
//     bids: Bid[]
// }

function BidsTable({ bids }) {
    //@ts-ignore
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = useCallback((bid: Bid) => {
        setSelectedBid(bid)
        setIsModalOpen(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedBid(null)
    }, [])

    const handleApprove = useCallback(async (bidId: string) => {
        try {
            const token = localStorage.getItem('authToken')
            await postData2(`/api/v1/bids/${bidId}/approve`, token)
            console.log(`Заявка ${bidId} одобрена`)
        } catch (error) {
            console.error('Ошибка при одобрении заявки:', error)
        }
    }, [])

    const handleDelete = useCallback(async (bidId: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить заявку ${bidId}?`)) return

        try {
            const token = localStorage.getItem('authToken')
            await deleteData(`/api/v1/bids/${bidId}`, token)
            console.log(`Заявка ${bidId} удалена`)
        } catch (error) {
            console.error('Ошибка при удалении заявки:', error)
        }
    }, [])

    const columns = useMemo<ColumnDef<Bid>[]>(
        () => [
            {
                accessorKey: '_id',
                header: 'ID',
                size: 50, // Устанавливаем ширину колонки в пикселях
                searchable: true
            },
            {
                accessorKey: 'persistentId',
                header: 'ЦМ ID',
                size: 100,
                searchable: true
            },
            {
                accessorKey: 'loadingMode',
                header: 'Операция',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'filingTime',
                header: 'Дата погрузки',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'terminal1.cityName',
                header: 'Терминал 1',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'warehouses.0.cityName',
                header: 'Склад',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'terminal2.cityName',
                header: 'Терминал 2',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'vehicleProfile.name',
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
                accessorKey: 'approvedStatus',
                header: 'Аукцион',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'myPrice',
                header: 'Моя цена',
                size: 100,
                searchable: true
            },
            {
                accessorKey: 'bestSalePrice',
                header: 'Предложение',
                size: 120,
                searchable: true
            },
            {
                accessorKey: 'isPriceRequest',
                header: 'Согласовано',
                size: 150,
                cell: ({ row }) => {
                    const isApproved = row.original.isPriceRequest
                    console.log(isApproved);

                    return (
                        <Button
                            onClick={() => handleApprove(row.original)}
                            disabled={isApproved}
                            variant={isApproved ? 'secondary' : 'default'}
                        >
                            {isApproved ? 'Согласовано' : 'Согласовать'}
                        </Button>
                    )
                },
                searchable: true
            },
            {
                accessorKey: 'extraServicesPrice',
                header: 'Доп услуги',
                size: 170,
                searchable: true
            },
            {
                accessorKey: 'fullPrice',
                header: 'Цена + доп усл',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'commission',
                header: 'Комиссия',
                size: 100,
                searchable: true
            },
            {
                accessorKey: 'fullPriceNDS',
                header: 'К оплате',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'createdAt',
                header: 'Создано',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'createdBy',
                header: 'Создал',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'client.organizationName',
                header: 'Клиент',
                size: 150,
                searchable: true
            },
            {
                accessorKey: 'customer.name',
                header: 'Заказчик',
                size: 150,
                searchable: true
            },
            {
                accessorKey: '',
                header: 'Действия',
                size: 80,
                cell: ({ row }) => {
                    return (
                        <div className='flex'>
                            <Eye className='mr-2 h-5 w-5' onClick={() => handleOpenModal(row.original)} />
                            <Trash
                                className='mr-2 h-5 w-5 cursor-pointer text-red-500'
                                onClick={() => handleDelete(row.original._id)}
                            />
                        </div>
                    )
                }
            }
        ],
        []
    )
    const table = useReactTable({
        data: bids,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnFilters: Object.entries(filters).map(([id, value]) => ({ id, value }))
        }
    } as TableOptions<Bid>)

    const handleFilterChange = useCallback((columnId: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [columnId]: value
        }))
    }, [])

    return (
        <div>
            <ScrollArea className='max-h-[80vh] w-full overflow-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {/* <div className='flex flex-col gap-2'> */}
                                        <div className={`w-[${header.column.columnDef.size}px] `}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.columnDef.searchable && (
                                                <Input
                                                    value={filters[header.column.id] || ''}
                                                    onChange={e => handleFilterChange(header.column.id, e.target.value)}
                                                    placeholder='Поиск...'
                                                    className='text-xs'
                                                />
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                onDoubleClick={() => handleOpenModal(row.original)}
                                className='cursor-pointer'
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>

            {selectedBid && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className='p-6'>
                        <h2 className='text-lg font-bold'>{selectedBid.cargoTitle}</h2>
                        <p>Клиент: {selectedBid.client.organizationName}</p>
                        <p>Цена: {selectedBid.price || '—'}</p>
                        <p>Статус: {selectedBid.status || '—'}</p>
                        <Button onClick={handleCloseModal}>Закрыть</Button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default BidsTable
