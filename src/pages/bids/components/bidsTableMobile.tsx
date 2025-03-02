import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useMemo, useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import info from '../../../../public/info.svg'
import useNumberFormatter from '@/hooks/use-format-number'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import AuctionTimer from '@/hooks/use-action-timer'
import BidsInfoModal from './bids-info-modal'
import BidCreateForm from './bid-create-form'
import PopupModal from '@/components/shared/popup-modal'

//@ts-ignore
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
    isPriceRequest?: boolean
    loadingDate: string
    customer?: { name: string }
    terminal1?: { cityName: string }
    terminal2?: { cityName: string }
    warehouses?: { cityName: string }[]
    vehicleProfile?: { name: string }
    [key: string]: unknown
}

interface BidsTableMobileProps {
    bids: any[]
}

function BidsTableMobile({ bids }: BidsTableMobileProps) {
    const [selectedBid, setSelectedBid] = useState(null)
    const [open, setOpen] = useState(false)
    // const { filters } = useFilter()
    // const { refreshBids } = useGetBids(200)

    const handleCloseModal = useCallback(() => {
        setOpen(false)
    }, [])

    const handleOpenModal = useCallback(order => {
        setSelectedBid(order)
        setOpen(true)
    }, [])

    const { formatNumber } = useNumberFormatter()

    // useEffect(() => {
    //     console.log('BidsTableMobile received new bids:', bids)
    //     console.log('Current filters:', filters)
    // }, [bids, filters])

    // useEffect(() => {
    //     refreshBids()
    // }, [refreshBids])

    // Группировка заявок по дате
    const groupedBids = useMemo(() => {
        const groups = {}
        const today = format(new Date(), 'dd.MM.yyyy', { locale: ru })

        //@ts-ignore
        bids.forEach(bid => {
            const date = format(new Date(bid.loadingDate), 'dd.MM.yyyy', { locale: ru })
            const label = date === today ? 'Сегодня' : date
            if (!groups[label]) {
                groups[label] = []
            }
            groups[label].push(bid)
        })
        return Object.entries(groups).sort(([a], [b]) =>
            //@ts-ignore
            a === 'Сегодня' ? -1 : b === 'Сегодня' ? 1 : new Date(b) - new Date(a)
        )
    }, [bids])

    return (
        <div className='flex flex-col gap-4'>
            <ScrollArea className='flex flex-col gap-4 max-h-[87vh] w-full overflow-auto rounded-md border'>
                {groupedBids.map(([date, bids]) => (
                    <div key={date}>
                        <h2 className='text-lg font-semibold p-2'>{date}</h2>
                        {/* @ts-ignore */}
                        {bids.map(bid => (
                            <Card key={bid.persistentId} className='p-4 shadow-md rounded-lg'>
                                <CardContent className='w-full !p-0 flex items-center gap-2'>
                                    <div onClick={() => handleOpenModal(bid)}>
                                        <img src={info} alt='' className='h-14' />
                                    </div>
                                    <div className='flex flex-col justify-center gap-[1px] mt-6'>
                                        <div className='flex items-center gap-2'>
                                            <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                                        </div>
                                        <div className='ml-[2.5px] w-[2px] h-[20px] bg-gray-300'></div>
                                        <div className='flex items-center gap-2'>
                                            <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                                        </div>
                                        <div className='ml-[2.5px] w-[2px] h-[20px] bg-gray-300'></div>
                                        <div className='flex items-center gap-2'>
                                            <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex justify-between'>
                                            <span className='font-semibold'>{bid.vehicleProfile?.name || '—'}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-lg font-semibold'>
                                                {bid.terminal1?.cityName || '—'}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-lg font-semibold'>
                                                {bid.warehouses?.[0]?.cityName || '—'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className='text-lg font-semibold'>
                                                {bid.terminal2?.cityName || '—'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='ml-auto flex flex-col'>
                                        <p className='text-green-600 font-semibold'>{bid.status}</p>
                                        <p className='text-green-600 font-semibold'>
                                            {bid.price ? `${formatNumber(bid.price)} ₽` : '—'}
                                        </p>
                                        <AuctionTimer activationTime={bid.activationTime} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))}
            </ScrollArea>

            <div className='flex gap-3 fixed bottom-3 px-6 py-6 text-[24px] left-1/2 -translate-x-1/2 w-full'>
                <PopupModal renderModal={onClose => <BidCreateForm modalClose={onClose} />} />
            </div>

            {selectedBid && (
                <BidsInfoModal
                    selectedBid={selectedBid}
                    handleCloseModal={handleCloseModal}
                    open={open}
                    onOpenChange={setOpen}
                />
            )}
        </div>
    )
}

export default BidsTableMobile
