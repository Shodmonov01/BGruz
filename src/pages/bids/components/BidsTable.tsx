import { useState, useCallback, useRef, useEffect } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { deleteData, postData2 } from '@/api/api'
import { useBidsTableColumns } from './bids-table/useBidsTableColumns'
import BidsInfoModal from './bids-info-modal'
import PopupModal from '@/components/shared/popup-modal'
import StudentCreateForm from './bid-create-form'
import { Search } from 'lucide-react'
import loader from '../../../../public/gear-spinner.svg'

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
            const isBottom = scrollTop + clientHeight >= scrollHeight - 50 // 50px запаса

            if (isBottom && hasMore && !loading) {
                isFetching = true
                loadMore()
                setTimeout(() => {
                    isFetching = false
                }, 500) // Задержка, чтобы избежать многократных вызовов
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
        await postData2(`api/v1/bids/${bidId}/approve`, {}, token) // Передаём пустой объект как data
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

    return (
        <div>
            <div className='flex '>
                {/* <Button className='mb-3' onClick={() => setIsShortTable(prev => !prev)}>
                    {isShortTable ? 'Полная версия' : 'Краткая версия'}
                </Button> */}
                <div className='w-full flex flex-wrap gap-5 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <span className='text-[#03B4E0] text-[38px]'>
                            Заявки <span className='text-primary'>|</span>
                        </span>
                        <div className='flex gap-3 '>
                            <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
                        </div>
                        <Button variant='outline'>Загрузить</Button>
                        <Button variant='outline'>Отменить</Button>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Button variant='secondary' onClick={() => setIsShortTable(prev => !prev)}>
                            {isShortTable ? 'Полная версия' : 'Краткая версия'}
                        </Button>
                        <div className='relative flex items-center w-full max-w-md'>
                            <Search className='absolute left-3 text-muted-foreground w-5 h-5' />
                            <Input
                                type='text'
                                placeholder='Поиск заявки'
                                className='pl-10 h-10 border border-border rounded-lg focus:ring-2 focus:ring-primary'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea>
                <div className='h-[calc(98vh-200px)] overflow-auto !scrollbar-thin !scrollbar-thumb-gray-400 !scrollbar-track-gray-100'>
                    <Table className='min-w-[1000px] border border-gray-300'>
                        {/* min-w делает горизонтальный скролл */}
                        <TableHeader className='sticky'>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className='bg-white border border-gray-300 whitespace-nowrap'
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
                                            className='bg-white border border-gray-300 whitespace-nowrap'
                                        >
                                            <div className='text-center'>
                                                {/* @ts-expect-error Пока не знаю что делать */}
                                                {header.column.columnDef.searchable && (
                                                    <Input
                                                        onChange={e =>
                                                            handleFilterChange(header.column.id, e.target.value)
                                                        }
                                                        placeholder='Поиск...'
                                                        className='text-xs h-7'
                                                    />
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
                                    // className={`hover:bg-gray-100 cursor-pointer ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
                                    className={`cursor-pointer hover:bg-gray-100 ${
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
                                            <img src={loader} alt='Загрузка...' className='h-8 w-8' />
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

export default BidsTable
