import { useState, useCallback, useReducer } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { deleteData, postData2 } from '@/api/api'
import { useBidsTableColumns } from './students-table/useBidsTableColumns'
import BidsInfoModal from './bids-info-modal'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

interface Bid {
    _id: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
}

function BidsTable({ bids }) {
    const [selectedBid, setSelectedBid] = useState<Partial<Bid> | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isShortTable, setIsShortTable] = useState(false)

    const [filters, dispatch] = useReducer(
        (state: Record<string, string>, { columnId, value }: { columnId: string; value: string }) => ({
            ...state,
            [columnId]: value
        }),
        {}
    )

    const handleFilterChange = (columnId: string, value: string) => {
        dispatch({ columnId, value })
    }

    const handleOpenModal = useCallback((bid: Bid) => {
        setSelectedBid(bid)
        setIsModalOpen(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedBid(null)
    }, [])

    const handleApprove = useCallback(async (bidId: string) => {
        const token = localStorage.getItem('authToken')
        await postData2(`/api/v1/bids/${bidId}/approve`, token)
    }, [])

    const handleDelete = useCallback(async (bidId: string) => {
        if (window.confirm(`Удалить заявку ${bidId}?`)) {
            const token = localStorage.getItem('authToken')
            await deleteData(`/api/v1/bids/${bidId}`, token)
        }
    }, [])

    const columns = useBidsTableColumns({
        isShortTable,
        onApprove: handleApprove,
        onDelete: handleDelete,
        onOpenModal: handleOpenModal
    })
    const table = useReactTable({ data: bids, columns, getCoreRowModel: getCoreRowModel() })

    return (
        <div>
            <div className='flex justify-between'>
                <Button className='mb-3' onClick={() => setIsShortTable(prev => !prev)}>
                    {isShortTable ? 'Полная версия' : 'Краткая версия'}
                </Button>

                <div className='flex gap-10 mb-3'>
                    <div>
                        <ul>
                            <li>
                                Сумма заявок: <span>10 000 000</span>
                            </li>
                            <li>
                                Комиссия: <span>500 000</span>
                            </li>
                            <li>
                                К оплате: <span>9 500 000</span>
                            </li>
                            <li>
                                и НДС: <span>1 900 000</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>Пользователь: Амир</li>
                            <li>Заказчик: Липовая Дирекция</li>
                            <li>Брокер: ЦМ</li>
                        </ul>
                    </div>
                </div>
            </div>

            <ScrollArea className=''>
                <Table>
                    <TableHeader className='sticky top-0 bg-white z-10 shadow-md'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className='bg-white'>
                                        <div style={{ width: header.column.columnDef.size }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {/* @ts-expect-error Пока не знаю что делать */}
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
                </Table>

                {/* Ограниченная высота и прокрутка только для тела таблицы */}
                <ScrollAreaPrimitive.Viewport className='h-[calc(65vh-50px)] overflow-y-auto'>
                    <Table>
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
                    
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>

            {selectedBid && (
                <BidsInfoModal
                    handleCloseModal={handleCloseModal}
                    selectedBid={selectedBid}
                    isModalOpen={isModalOpen}
                />
            )}
        </div>
    )
}

export default BidsTable
