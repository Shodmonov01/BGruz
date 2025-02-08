import { useState, useCallback, useRef } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { deleteData, postData2 } from '@/api/api'
import { useBidsTableColumns } from './students-table/useBidsTableColumns'
import BidsInfoModal from './bids-info-modal'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { useGetBids } from '@/hooks/useGetBids'

interface Bid {
    _id: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
}

function BidsTable() {
    const [selectedBid, setSelectedBid] = useState<Partial<Bid> | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isShortTable, setIsShortTable] = useState(false)
    const { bids, setFilters, refreshTable } = useGetBids(20)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const handleFilterChange = (columnId: string, value: string) => {
        const newFilters = { ...localFilters }
        if (value) newFilters[columnId] = value
        else delete newFilters[columnId]

        setLocalFilters(newFilters)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            console.log('Обновляем фильтры:', newFilters)
            setFilters(newFilters)
            refreshTable()
        }, 500)
    }

    const handleOpenModal = useCallback((bid: Bid) => {
        setSelectedBid(bid)
        setIsModalOpen(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedBid(null)
    }, [])

    const columns = useBidsTableColumns({ isShortTable, onOpenModal: handleOpenModal })
    const table = useReactTable({ data: bids || [], columns, getCoreRowModel: getCoreRowModel() })

    return (
        <div>
            <Input onChange={e => handleFilterChange('clientName', e.target.value)} placeholder='Фильтр по клиенту' />

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.columnDef.searchable && (
                                        <Input onChange={e => handleFilterChange(header.column.id, e.target.value)} />
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} onDoubleClick={() => handleOpenModal(row.original)}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
