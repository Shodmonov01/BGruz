import { useState, useCallback, useRef, useEffect } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import type { DateRange } from 'react-day-picker'
import { useBidsTableColumns } from './bids-table/useBidsTableColumns'
import BidsInfoModal from './bids-info-modal'
import BidHeader from './bids-header'
import { deleteData, postData2 } from '@/api/api'
import loader from '../../../../public/gear-spinner.svg'
import { DateRangePicker } from './bid-form-detail/rangePicker'
import { Button } from '@/components/ui/button'

interface Bid {
    _id?: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
}

function BidsTable({ bids, setFilters, handleFilterChange, loadMore, hasMore, loading }) {
    const [selectedBid, setSelectedBid] = useState<Partial<Bid> | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isShortTable, setIsShortTable] = useState(false)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let isFetching = false

        const handleScroll = () => {
            if (!scrollRef.current || isFetching) return

            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            const isBottom = scrollTop + clientHeight >= scrollHeight - 50

            if (isBottom && hasMore && !loading) {
                isFetching = true
                loadMore()
                setTimeout(() => {
                    isFetching = false
                }, 500)
            }
        }

        const currentScroll = scrollRef.current
        if (currentScroll) {
            currentScroll.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (currentScroll) {
                currentScroll.removeEventListener('scroll', handleScroll)
            }
        }
    }, [hasMore, loading, loadMore])

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
        await postData2(`api/v1/bids/${bidId}/approve`, {}, token)
    }, [])

    const handleDelete = useCallback(async (bidId: string) => {
        if (window.confirm(`Удалить заявку ${bidId}?`)) {
            const token = localStorage.getItem('authToken')
            await deleteData(`api/v1/bids/${bidId}`, token)
        }
    }, [])

    const columns = useBidsTableColumns({
        isShortTable,
        onApprove: handleApprove,
        onDelete: handleDelete,
        onOpenModal: handleOpenModal
    })
    const table = useReactTable({ data: bids || [], columns, getCoreRowModel: getCoreRowModel() })
    console.log('columns', columns)

    return (
        <div>
            <BidHeader setIsShortTable={setIsShortTable} isShortTable={isShortTable} />

            <ScrollArea>
                <div className='h-[calc(98vh-200px)] overflow-auto !scrollbar-thin !scrollbar-thumb-gray-400 !scrollbar-track-gray-100'>
                    <Table className='min-w-[1000px] border border-gray-300'>
                        <TableHeader className='sticky '>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className='bg-[#EDEDED] font-bold text-[20px] border border-gray-300 whitespace-nowrap'
                                        >
                                            <div className='text-center'>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className='bg-[#EDEDED] border border-gray-300 whitespace-nowrap'
                                        >
                                            <div className='text-center'>
                                                {/* @ts-expect-error что нибудь придумаем */}
                                                {header.column.columnDef.searchable && (
                                                    <div className='text-center'>
                                                        {renderFilterInput(header.column, handleFilterChange)}
                                                    </div>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    onDoubleClick={() => handleOpenModal(row.original)}
                                    key={row.id}
                                    className={`cursor-pointer text-[16px] hover:bg-gray-100 ${
                                        row.original.ownState === 'canceled'
                                            ? 'bg-gray-50 opacity-50 line-through'
                                            : index % 2 === 0
                                              ? 'bg-gray-100'
                                              : ''
                                    }`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className='border border-gray-300 text-center whitespace-nowrap !p-0 !px-1'
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='text-center p-4'>
                                        <div className='flex items-center justify-center'>
                                            <img
                                                src={loader || '/placeholder.svg'}
                                                alt='Загрузка...'
                                                className='h-8 w-8'
                                            />
                                            <span className='ml-2 text-gray-500'>Загрузка данных...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && !bids.length && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='text-center p-4'>
                                        <span className='text-gray-500'>Нет данных для отображения</span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
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

function renderFilterInput(column, handleFilterChange) {
    const filterType = column.columnDef.filterType
    const filterOptions = column.columnDef.filterOptions

    switch (filterType) {
        case 'exact':
            return (
                <Input
                    onChange={e => handleFilterChange(column.id, e.target.value)}
                    placeholder='Точное совпадение'
                    className='text-xs h-7 bg-white'
                />
            )
        case 'select':
            return (
                <Select onValueChange={value => handleFilterChange(column.id, value)} defaultValue='Все'>
                    <SelectTrigger className='text-xs h-7 bg-white'>
                        <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case 'dateRange':
            return (
                <DateRangePicker
                    onChange={range => handleFilterChange(column.id, range)}
                    placeholder='Выберите даты'
                    className='text-xs h-7 bg-white'
                />
            )
        case 'fuzzy':
            return (
                <Input
                    onChange={e => handleFilterChange(column.id, e.target.value)}
                    placeholder='Поиск...'
                    className='text-xs h-7 bg-white'
                />
            )
        case 'range':
            return (
                <div className='flex gap-2 items-center'>
                    <Button className='p-1' onClick={() => handleFilterChange(column.id, 'asc')}>
                        Возраст
                    </Button>
                    <Button className='p-1' onClick={() => handleFilterChange(column.id, 'desc')}>
                        Убыв
                    </Button>
                </div>
            )
        default:
            return null
    }
}

export default BidsTable
