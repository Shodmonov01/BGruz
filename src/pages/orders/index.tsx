import { useState, useEffect, useRef, useCallback } from 'react'
// import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import BgruzHeader from '@/components/shared/bgruz-header'
// import { Input } from '@/components/ui/input'
// import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
// import OrdersHeader from './components/orders-header'
import { useGetOrders } from '@/hooks/useGetOrders'
import OrdersTable from './components/orders-table'
import { useSearchParams } from 'react-router-dom'
import OrderTableMobile from './components/ordersTableMobile'
import { TotalsProvider } from '@/lib/TotalsContext'

export default function OrderPage() {
    // const [isShortTable, setIsShortTable] = useState(false)
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 50)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { orders, hasMore, loading, setFilters, refreshTable } = useGetOrders(size)

    const handleFilterChange = useCallback(
        (columnId: string, value: any) => {
            let formattedValue = value

            if (columnId === 'loadingMode' || columnId === 'cargoType' || columnId === 'status') {
                formattedValue = Array.isArray(value) ? value : [value]
            } else if ((columnId === 'loadingDate' || columnId === 'createdAt') && value) {
                formattedValue = {
                    start: new Date(value.from.setHours(23, 59, 59, 999)).toISOString(),
                    end: new Date(value.to.setHours(23, 59, 59, 999)).toISOString()
                }
            } else if (['number', 'fullPrice', 'comission', 'extraServicesPrice'].includes(columnId)) {
                formattedValue = Number(value)
            }

            const newFilters = {
                ...localFilters,
                [columnId]: formattedValue
            }

            setLocalFilters(newFilters)
            setFilters(newFilters)

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(async () => {
                const filterPayload = {
                    filter: {
                        ...newFilters
                    },
                    sort: {
                        filterFieldName: 'createdAt',
                        direction: 'descending'
                    },
                    size: size
                }

                try {
                    const token = localStorage.getItem('authToken') || ''
                    const response = await fetch('https://portal.bgruz.com/api/v1/orders/getbatch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(filterPayload)
                    })

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    await response.json()
                    refreshTable()
                } catch (error) {
                    console.error('Error in filter change:', error)
                }
            }, 500)
        },
        [localFilters, size, refreshTable]
    )

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
                        <TotalsProvider data={orders}>


            <BgruzHeader />
            {/* <OrdersHeader setIsShortTable={setIsShortTable} isShortTable={isShortTable} /> */}
            <div className='hidden md:block'>
                <OrdersTable
                    orders={orders || []}
                    setFilters={setFilters}
                    handleFilterChange={handleFilterChange}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    loading={loading}
                    localFilters={localFilters}
                    />
            </div>
            <div className='md:hidden'>
                <OrderTableMobile orders={orders || []} />
            </div>
                    </TotalsProvider>

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
