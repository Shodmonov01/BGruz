import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar from '../shared/sidebar'
import Header from '../shared/header'
import MobileSidebar from '../shared/mobile-sidebar'
import { MenuIcon } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useGetBids } from '@/api/use-get-bids'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    // const [currentStatus, setCurrentStatus] = useState()
    const [searchParams] = useSearchParams()
    //@ts-expect-error dfjbhu djni
    const [size, setSize] = useState(Number(searchParams.get('size')) || 200)
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { setFilters, refreshBids } = useGetBids(size)

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

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                setLocalFilters(newFilters)
                setFilters(newFilters)
                refreshBids()
            }, 500)
        },
        [localFilters, setFilters, refreshBids]
    )

    useEffect(() => {
        refreshBids()
    }, [localFilters])

    return (
        <div className='flex h-screen overflow-hidden bg-secondary'>
            <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar />
            <div className='flex w-0 flex-1 flex-col overflow-hidden'>
                <div className='sticky z-10 flex h-20 flex-shrink-0 md:hidden'>
                    <button
                        className='pl-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden'
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className='sr-only'>Open sidebar</span>
                        <MenuIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                    <Header handleFilterChange={handleFilterChange} localFilters={localFilters} />
                </div>
                <main className='relative mx-2 my-3 mr-2 flex-1 overflow-hidden rounded-xl  bg-background focus:outline-none md:mx-0 md:my-4 md:mr-4 '>
                    {children}
                </main>
            </div>
        </div>
    )
}
