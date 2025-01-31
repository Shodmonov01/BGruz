import { useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
// import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface Bid {
    persistentId: string
    cargoTitle: string
    client: { organizationName: string }
    price: number | null
    status: string | null
    filingTime: string
    createdBy: string
    createdAt: string
}

export default function BidsTable({ bids }) {
    //@ts-ignore
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // const handleFilterChange = (columnId: string, value: string) => {
    //     setFilters(prev => ({ ...prev, [columnId]: value }))
    // }

    const columns: ColumnDef<Bid>[] = [
        {
            accessorKey: '_id',
            header: 'ID',
            size: 50 // Устанавливаем ширину колонки в пикселях
        },
        {
            accessorKey: 'persistentId',
            header: 'ЦМ ID',
            size: 100 // Устанавливаем ширину колонки в пикселях
        },
        {
            accessorKey: 'loading_mode',
            header: 'Операция',
            size: 150
        },
        {
            accessorKey: 'loadingDate',
            header: 'Дата погрузки',
            size: 150
        },
        {
            accessorKey: 'terminal1.cityName',
            header: 'Терминал 1',
            size: 120
        },
        {
            accessorKey: 'warehouses.0.cityName',
            header: 'Склад',
            size: 120
        },
        {
            accessorKey: 'terminal2.cityName',
            header: 'Терминал 2',
            size: 120
        },
        {
            accessorKey: 'vehicleProfile.name',
            header: 'Профиль ТС',
            size: 150
        },
        {
            accessorKey: 'status',
            header: 'Статус',
            size: 100
        },
        {
            accessorKey: 'approvedStatus',
            header: 'Аукцион',
            size: 150
        },
        {
            accessorKey: 'myPrice',
            header: 'Моя цена',
            size: 100
        },
        {
            accessorKey: 'bestSalePrice',
            header: 'Предложение',
            size: 120
        },
        {
            accessorKey: 'isPriceRequest',
            header: 'Согласовано',
            size: 150,
            cell: ({ row }) => <Button onClick={() => handleAuctionClick(row.original)}>Согласовано</Button>
        },
        {
            accessorKey: 'extraServicesPrice',
            header: 'Доп услуги',
            size: 170
        },
        {
            accessorKey: 'fullPrice',
            header: 'Цена + доп усл',
            size: 150
        },
        {
            accessorKey: 'commission',
            header: 'Комиссия',
            size: 100
        },
        {
            accessorKey: 'fullPriceNDS',
            header: 'К оплате',
            size: 150
        },
        {
            accessorKey: 'createdAt',
            header: 'Создано',
            size: 150
        },
        {
            accessorKey: 'createdBy',
            header: 'Создал',
            size: 150
        },
        {
            accessorKey: 'client.name',
            header: 'Клиент',
            size: 150
        },
        {
            accessorKey: 'customer.name',
            header: 'Заказчик',
            size: 150
        }
    ]

    const handleAuctionClick = (bid: Bid) => {
        // Здесь можно добавить логику для обработки аукциона
        console.log(`Аукцион для заявки с ID ${bid.persistentId}`)
    }

    const table = useReactTable({
        data: bids,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { columnFilters: Object.entries(filters).map(([id, value]) => ({ id, value })) }
    })

    return (
        <div>
            <ScrollArea className='max-h-[1200px] w-full overflow-auto h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-80px)]'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        <div className={`w-[${header.column.columnDef.size}px]`}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {/* <Input
                                                    value={filters[header.column.id] || ''}
                                                    onChange={e => handleFilterChange(header.column.id, e.target.value)}
                                                    placeholder='Поиск...'
                                                    className='mt-1 text-xs'
                                                /> */}
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
                                onDoubleClick={() => {
                                    setSelectedBid(row.original)
                                    setIsModalOpen(true)
                                }}
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
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedBid && (
                    <div className='p-6'>
                        <h2 className='text-lg font-bold'>{selectedBid.cargoTitle}</h2>
                        <p>Клиент: {selectedBid.client.organizationName}</p>
                        <p>Статус: {selectedBid.status || '—'}</p>
                        <p>Цена: {selectedBid.price || '—'}</p>
                        <Button onClick={() => setIsModalOpen(false)}>Закрыть</Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}
