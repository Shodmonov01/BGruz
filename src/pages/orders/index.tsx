import { useState, useEffect, useRef } from 'react'
// import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import BgruzHeader from '@/components/shared/bgruz-header'
// import { Input } from '@/components/ui/input'
// import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
// import OrdersHeader from './components/orders-header'
import { useGetOrders } from '@/hooks/useGetOrders'
import OrdersTable from './components/orders-table'
import { useSearchParams } from 'react-router-dom'

export default function OrderPage() {
    // const [isShortTable, setIsShortTable] = useState(false)
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 50)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { orders, hasMore, loading, setFilters, refreshTable } = useGetOrders(size)

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

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }
    console.log('orders', orders)

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                if (hasMore && !loading) {
                    loadMore()
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hasMore, loading])

    return (
        <div className='p-4'>
            <BgruzHeader />
            {/* <OrdersHeader setIsShortTable={setIsShortTable} isShortTable={isShortTable} /> */}
            <OrdersTable
                orders={orders || []}
                setFilters={setFilters}
                handleFilterChange={handleFilterChange}
                loadMore={loadMore}
                hasMore={hasMore}
                loading={loading}
            />
            {/* <Table className='border rounded-lg border-gray-300 w-full'>
                <TableHeader>
                    <TableRow className='border border-gray-300'>
                        {table.getHeaderGroups().map(headerGroup =>
                            headerGroup.headers.map(header => (
                                <TableHead key={header.id} className='border bg-[#EDEDED] border-gray-300 p-2'>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))
                        )}
                    </TableRow>
                    <TableRow className='border border-gray-300'>
                        {table.getHeaderGroups().map(headerGroup =>
                            headerGroup.headers.map(header => (
                                <TableHead key={header.id} className='border bg-[#EDEDED] border-gray-300 p-2'>
                                    {header.column.columnDef.accessorKey ? (
                                        <Input
                                            type='text'
                                            placeholder='Поиск'
                                            className='border bg-white border-gray-300 p-1 text-xs w-full'
                                        />
                                    ) : null}
                                </TableHead>
                            ))
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} className='border border-gray-300'>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} className='border border-gray-300 p-2'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}
        </div>
    )
}
