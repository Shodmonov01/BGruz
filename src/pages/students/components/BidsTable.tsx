// import { useState } from 'react'
// import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
// import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
// // import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Modal } from '@/components/ui/modal'
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

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

//     // const handleFilterChange = (columnId: string, value: string) => {
//     //     setFilters(prev => ({ ...prev, [columnId]: value }))
//     // }

//     const columns: ColumnDef<Bid>[] = [
//         {
//             accessorKey: '_id',
//             header: 'ID',
//             size: 50 // Устанавливаем ширину колонки в пикселях
//         },
//         {
//             accessorKey: 'persistentId',
//             header: 'ЦМ ID',
//             size: 100 // Устанавливаем ширину колонки в пикселях
//         },
//         {
//             accessorKey: 'loading_mode',
//             header: 'Операция',
//             size: 150
//         },
//         {
//             accessorKey: 'loadingDate',
//             header: 'Дата погрузки',
//             size: 150
//         },
//         {
//             accessorKey: 'terminal1.cityName',
//             header: 'Терминал 1',
//             size: 120
//         },
//         {
//             accessorKey: 'warehouses.0.cityName',
//             header: 'Склад',
//             size: 120
//         },
//         {
//             accessorKey: 'terminal2.cityName',
//             header: 'Терминал 2',
//             size: 120
//         },
//         {
//             accessorKey: 'vehicleProfile.name',
//             header: 'Профиль ТС',
//             size: 150
//         },
//         {
//             accessorKey: 'status',
//             header: 'Статус',
//             size: 100
//         },
//         {
//             accessorKey: 'approvedStatus',
//             header: 'Аукцион',
//             size: 150
//         },
//         {
//             accessorKey: 'myPrice',
//             header: 'Моя цена',
//             size: 100
//         },
//         {
//             accessorKey: 'bestSalePrice',
//             header: 'Предложение',
//             size: 120
//         },
//         {
//             accessorKey: 'isPriceRequest',
//             header: 'Согласовано',
//             size: 150,
//             cell: ({ row }) => <Button onClick={() => handleAuctionClick(row.original)}>Согласовано</Button>
//         },
//         {
//             accessorKey: 'extraServicesPrice',
//             header: 'Доп услуги',
//             size: 170
//         },
//         {
//             accessorKey: 'fullPrice',
//             header: 'Цена + доп усл',
//             size: 150
//         },
//         {
//             accessorKey: 'commission',
//             header: 'Комиссия',
//             size: 100
//         },
//         {
//             accessorKey: 'fullPriceNDS',
//             header: 'К оплате',
//             size: 150
//         },
//         {
//             accessorKey: 'createdAt',
//             header: 'Создано',
//             size: 150
//         },
//         {
//             accessorKey: 'createdBy',
//             header: 'Создал',
//             size: 150
//         },
//         {
//             accessorKey: 'client.name',
//             header: 'Клиент',
//             size: 150
//         },
//         {
//             accessorKey: 'customer.name',
//             header: 'Заказчик',
//             size: 150
//         }
//     ]

//     const handleAuctionClick = (bid: Bid) => {
//         // Здесь можно добавить логику для обработки аукциона
//         console.log(`Аукцион для заявки с ID ${bid.persistentId}`)
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
//                                         <div className={`w-[${header.column.columnDef.size}px]`}>
//                                             {flexRender(header.column.columnDef.header, header.getContext())}
//                                             {/* <Input
//                                                     value={filters[header.column.id] || ''}
//                                                     onChange={e => handleFilterChange(header.column.id, e.target.value)}
//                                                     placeholder='Поиск...'
//                                                     className='mt-1 text-xs'
//                                                 /> */}
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
//                                 onDoubleClick={() => {
//                                     setSelectedBid(row.original)
//                                     setIsModalOpen(true)
//                                 }}
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

import { useState } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit, Eye, Trash, SquareCheck } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

interface Bid {
    persistentId: string
    cargoTitle: string
    client: { organizationName: string }
    price: number | null
    status: string | null
    startDate: string
    direction: { fromCityId: number; toCityId: number; price: number | null }
    vehicleProfile: { name: string }
    terminal1: { cityName: string; address: string }
    terminal2: { cityName: string; address: string }
    filingTime: string
    vehicleCount: number
    createdBy: string
    createdAt: string
    description: string
    loadingMode
    warehouses
    isPriceRequest
    fullPrice
    ownState
}

interface Props {
    bids: Bid[]
}

const columnWidths: { [key: string]: string } = {
    bidId: '200px',
    loadingMode: '200px',
    filingTime: '200px',
    terminal1: '200px',
    warehouses: '200px',
    terminal2: '200px',
    vehicleProfile: '200px',
    status: '200px',
    isPriceRequest: '200px',
    price: '200px',
    fullPrice: '200px',
    ownState: '200px',
    client: '200px',
    createdBy: '200px',
    createdAt: '200px'
}

export default function BidsTable({ bids }) {
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [search, setSearch] = useState({
        cargoTitle: '',
        clientName: '',
        status: ''
    })

    const handleOpenModal = (bid: Bid) => {
        setSelectedBid(bid)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedBid(null)
    }

    const [isFullView, setIsFullView] = useState(true) // Состояние для переключения между полной и краткой версией

    const filteredBids = bids.filter(bid =>
        Object.entries(search).every(([key, value]) =>
            String(key === 'clientName' ? bid.client.organizationName : (bid as any)[key])
                .toLowerCase()
                .includes(value.toLowerCase())
        )
    )
    console.log(filteredBids)

    return (
        <div>
            <Button className='my-5' onClick={() => setIsFullView(!isFullView)}>
                {isFullView ? 'Краткий вид' : 'Полный вид'}
            </Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        {isFullView &&
                            Object.keys(columnWidths).map(key => (
                                <TableHead key={key} style={{ width: columnWidths[key] }}>
                                    <Input
                                        placeholder={`Поиск по ${key}`}
                                        value={(search as any)[key] || ''}
                                        onChange={e => setSearch({ ...search, [key]: e.target.value })}
                                    />
                                </TableHead>
                            ))}
                    </TableRow>
                    <TableRow>
                        {isFullView ? (
                            <>
                                <TableHead style={{ width: columnWidths.bidId }}>ID</TableHead>
                                <TableHead style={{ width: columnWidths.loadingMode }}>Операции</TableHead>
                                <TableHead style={{ width: columnWidths.filingTime }}>Дата Погрузки</TableHead>
                                <TableHead style={{ width: columnWidths.terminal1 }}>Терминал 1</TableHead>
                                <TableHead style={{ width: columnWidths.warehouses }}>Склад</TableHead>
                                <TableHead style={{ width: columnWidths.terminal2 }}>Терминал 2</TableHead>
                                <TableHead style={{ width: columnWidths.vehicleProfile }}>Профиль ТС</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Статус</TableHead>
                                <TableHead style={{ width: columnWidths.isPriceRequest }}>Торги</TableHead>
                                <TableHead style={{ width: columnWidths.price }}>Моя Цена</TableHead>
                                <TableHead style={{ width: columnWidths.fullPrice }}>Предложение</TableHead>
                                <TableHead style={{ width: columnWidths.ownState }}>Согласовано</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Доп Услуги</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Цена + доп ус.</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Комиссия</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>К оплате</TableHead>
                                <TableHead style={{ width: columnWidths.createdAt }}>Создано</TableHead>
                                <TableHead style={{ width: columnWidths.createdBy }}>Создал</TableHead>
                                <TableHead style={{ width: columnWidths.client }}>Клиент</TableHead>
                                <TableHead style={{ width: columnWidths.client }}>Действии</TableHead>
                            </>
                        ) : (
                            <>
                                <TableRow>
                                    {isFullView &&
                                        Object.keys(columnWidths).map(key => (
                                            <TableHead key={key} style={{ width: columnWidths[key] }}>
                                                <Input
                                                    placeholder={`Поиск по ${key}`}
                                                    value={(search as any)[key] || ''}
                                                    onChange={e => setSearch({ ...search, [key]: e.target.value })}
                                                />
                                            </TableHead>
                                        ))}
                                </TableRow>
                                <TableHead style={{ width: columnWidths.bidId }}>ID</TableHead>
                                <TableHead style={{ width: columnWidths.loadingMode }}>Операции</TableHead>
                                <TableHead style={{ width: columnWidths.filingTime }}>Дата Погрузки</TableHead>
                                <TableHead style={{ width: columnWidths.terminal1 }}>Терминал 1</TableHead>
                                <TableHead style={{ width: columnWidths.warehouses }}>Склад</TableHead>
                                <TableHead style={{ width: columnWidths.terminal2 }}>Терминал 2</TableHead>
                                <TableHead style={{ width: columnWidths.vehicleProfile }}>Профиль ТС</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Статус</TableHead>
                                <TableHead style={{ width: columnWidths.isPriceRequest }}>Торги</TableHead>
                                <TableHead style={{ width: columnWidths.price }}>Моя Цена</TableHead>
                                <TableHead style={{ width: columnWidths.fullPrice }}>Предложение</TableHead>
                                <TableHead style={{ width: columnWidths.ownState }}>Согласовано</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Доп Услуги</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Цена + доп ус.</TableHead>
                                <TableHead style={{ width: columnWidths.status }}>Цена + доп ус.</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredBids.map(bid => (
                        <TableRow onDoubleClick={() => handleOpenModal(bid)} key={bid.persistentId}>
                            {isFullView ? (
                                <>
                                    <TableCell>{bid.persistentId || '—'}</TableCell>
                                    <TableCell>{bid.loadingMode || '—'}</TableCell>
                                    <TableCell>{bid.filingTime || '—'}</TableCell>
                                    <TableCell>{bid.terminal1.cityName || '—'}</TableCell>
                                    <TableCell>{bid.warehouses.cityName || '—'}</TableCell>
                                    <TableCell>{bid.terminal2.cityName || '—'}</TableCell>
                                    <TableCell>{bid.vehicleProfile.name || '—'}</TableCell>
                                    <TableCell>{bid.status || '—'}</TableCell>
                                    <TableCell>{bid.isPriceRequest || '—'}</TableCell>
                                    <TableCell>{bid.price || '—'}</TableCell>
                                    <TableCell>{bid.fullPrice || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                    <TableCell>{bid.createdAt || '—'}</TableCell>
                                    <TableCell>{bid.createdBy || '—'}</TableCell>
                                    <TableCell>{bid.client.organizationName || '—'}</TableCell>
                                    <TableCell>
                                        <div className='flex'>
                                            <SquareCheck className='mr-2 h-5 w-5' />
                                            <Eye className='mr-2 h-5 w-5' onClick={() => handleOpenModal(bid)} />
                                            {/* <Edit className='mr-2 h-5 w-5' /> */}
                                            <Trash className='mr-2 h-5 w-5' />
                                        </div>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{bid.persistentId || '—'}</TableCell>
                                    <TableCell>{bid.loadingMode || '—'}</TableCell>
                                    <TableCell>{bid.filingTime || '—'}</TableCell>
                                    <TableCell>{bid.terminal1.cityName || '—'}</TableCell>
                                    <TableCell>{bid.warehouses.cityName || '—'}</TableCell>
                                    <TableCell>{bid.terminal2.cityName || '—'}</TableCell>
                                    <TableCell>{bid.vehicleProfile.name || '—'}</TableCell>
                                    <TableCell>{bid.status || '—'}</TableCell>
                                    <TableCell>{bid.isPriceRequest || '—'}</TableCell>
                                    <TableCell>{bid.price || '—'}</TableCell>
                                    <TableCell>{bid.fullPrice || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                    <TableCell>{bid.ownState || '—'}</TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                className='!bg-background !px-1 w-[370px] md:w-[800px]'
            >
                <div className='p-6'>
                    <h2 className='text-lg font-bold'>{selectedBid?.cargoTitle}</h2>
                    <p>Клиент: {selectedBid?.client.organizationName}</p>
                    <p>Статус: {selectedBid?.status || '—'}</p>
                    <p>Цена: {selectedBid?.price || '—'}</p>
                    <Button onClick={handleCloseModal}>Закрыть</Button>
                </div>
            </Modal>
        </div>
    )
}
