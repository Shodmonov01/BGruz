import { useCallback, useMemo, useState, useEffect } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import useNumberFormatter from '@/hooks/use-format-number'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import AuctionTimer from '@/hooks/use-action-timer'
import BidsInfoModal from '../bids-info-modal'
import BidCreateForm from '../bid-create-form'
import PopupModal from '@/components/shared/popup-modal'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { postData2 } from '@/api/api'
import useInfiniteScroll from '@/hooks/use-infinity-scroll'
// import { Input } from '@/components/ui/input'
import { MobileFilters } from './mobile-filters'
import { Loader2 } from 'lucide-react'
// import { useFilter } from '@/context/filter-context'
import { useWebSocket } from '@/api/use-websocket'
import { useBidContext } from '@/context/bid-context'

const statusTranslations = {
    active: 'Активна',
    waiting: 'На ожидании',
    executed: 'Выполнена',
    canceled: 'Отменена'
}

interface BidsTableMobileProps {
    bids: any[]
    loading: boolean
    loadMore: () => void
    hasMore: boolean
}

// Generate a unique key for each bid based on its properties
const getBidKey = (bid: any) => {
    // Use the bid's unique identifiers in this order of preference
    if (bid.id) return `bid-${bid.id}`;
    if (bid._id) return `bid-${bid._id}`;
    if (bid.persistentId) return `bid-${bid.persistentId}`;
    
    // If no ID is available, create a hash from bid properties
    const keyProps = [
        bid.client?.organizationName,
        bid.cargoTitle,
        bid.status,
        bid.createdAt
    ].filter(Boolean).join('-');
    
    return `bid-${keyProps}-${Math.random().toString(36).substr(2, 9)}`;
};

function BidsTableMobile({ bids: initialBids, loadMore, hasMore, loading }: BidsTableMobileProps) {
    // @ts-expect-error надо посмотреть
    const { bids, setBids, newBidId, setNewBidId } = useBidContext();
    const [localBids, setLocalBids] = useState(initialBids);
    const [selectedBid, setSelectedBid] = useState<any>(null)
    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading)
    const [open, setOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    // const [searchQuery, setSearchQuery] = useState('')
    // const { filters } = useFilter()

    useEffect(() => {
        setLocalBids(initialBids);
    }, [initialBids]);

    useEffect(() => {
        if (newBidId) {
            loadMore();
            setNewBidId(null);
        }
    }, [newBidId, loadMore, setNewBidId]);
// @ts-expect-error надо посмотреть
    const handleBidUpdate = useCallback((updatedBid) => {
        setLocalBids(currentBids => 
            currentBids.map(bid => 
                bid.persistentId === updatedBid.persistentId 
                    ? { ...bid, bestSalePrice: updatedBid.bestSalePrice }
                    : bid
            )
        );
    }, []);

    const handleWebSocketMessage = (data) => {
        if (data.type === 'bid_best_price_update') {
            setLocalBids(currentBids => 
                currentBids.map(bid => 
                    bid.id === data.payload.id 
                        ? { ...bid, status: data.payload.status }
                        : bid
                )
            );
        }
    };

    useWebSocket(handleWebSocketMessage);

    const handleCloseModal = useCallback(() => {
        setOpen(false)
    }, [])

    const handleOpenModal = useCallback(order => {
        setSelectedBid(order)
        setOpen(true)
    }, [])

    const handleConfirmOpen = useCallback(() => {
        setConfirmOpen(true)
    }, [])

    const handleConfirmClose = useCallback(() => {
        setConfirmOpen(false)
    }, [])

    const handleApprove = useCallback(async (bidId: string) => {
        const token = localStorage.getItem('authToken')
        await postData2(`api/v1/bids/${bidId}/approve`, {}, token)
    }, [])

    const { formatNumber } = useNumberFormatter()
    const groupedBids = useMemo(() => {
        const groups = {}
        const today = format(new Date(), 'dd.MM.yyyy', { locale: ru })

        localBids.forEach(bid => {
            const date = format(new Date(bid.loadingDate), 'dd.MM.yyyy', { locale: ru })
            const label = date === today ? 'Сегодня' : date
            if (!groups[label]) {
                groups[label] = []
            }
            groups[label].push(bid)
        })
        return Object.entries(groups).sort(([a], [b]) =>
            // @ts-expect-error надо посмотреть
            a === 'Сегодня' ? -1 : b === 'Сегодня' ? 1 : new Date(b) - new Date(a)
        )
    }, [localBids])

    return (
        <div className="space-y-4">
            <div className="sticky top-0 z-10 bg-background p-4 border-b">
                <div className="flex items-center gap-2">
                    {/* <Input
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    /> */}
                    {/* @ts-expect-error надо разобраться */}
                    <MobileFilters />
                </div>
            </div>

            {loading && !localBids ? (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Загрузка заявок...</span>
                </div>
            ) : localBids && localBids.length > 0 ? (
                <div className='flex flex-col gap-4 bg-secondary'>
                    <ScrollArea className='flex flex-col gap-4 max-h-[87vh] w-full overflow-auto rounded-md border'>
                        {groupedBids.map(([date, dateBids]) => (
                            <div ref={sentinelRef} key={date} className='flex flex-col gap-2'>
                                <h2 className='text-lg font-semibold p-2'>{date}</h2>
                                {/* @ts-expect-error надо разобраться */}
                                {dateBids.map(bid => {
                                    const isDisabled =
                                        !bid.bestSalePrice || bid.status === 'canceled' || bid.ownState === 'approved'

                                    // Generate a truly unique key for each bid
                                    const bidKey = getBidKey(bid);
                                    
                                    return (
                                        <div key={bidKey} className='p-2 shadow-md rounded-lg bg-white'>
                                            <div onClick={() => handleOpenModal(bid)} className='w-full !p-0 flex items-center flex-row-reverse gap-2'>
                                                <div  className='w-1/2'>
                                                    <div className='ml-auto flex flex-col'>
                                                        <p className='font-semibold'>
                                                            Предложение{' '}
                                                            <span className='text-green-600'>
                                                                {bid.bestSalePrice
                                                                    ? `${formatNumber(bid.bestSalePrice)} ₽`
                                                                    : '—'}
                                                            </span>
                                                        </p>
                                                        <p className='font-semibold'>
                                                            Моя цена{' '}
                                                            <span className='text-green-600'>
                                                                {bid.price ? `${formatNumber(bid.price)} ₽` : 'Запрос'}
                                                            </span>
                                                        </p>
                                                        <div className='flex gap-2'>
                                                            <p className='text-green-600 font-semibold'>
                                                                {statusTranslations[bid.status] || bid.status || '—'}
                                                            </p>
                                                        </div>
                                                        <AuctionTimer activationTime={bid.activationTime} />
                                                    </div>
                                                </div>
                                                <div className='flex w-1/2 gap-2'>
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
                                                            <span className='font-semibold'>
                                                                {bid.vehicleProfile?.name || '—'}
                                                            </span>
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
                                                </div>
                                            </div>
                                            <Button
                                                disabled={isDisabled}
                                                className={isDisabled ? 'bg-gray-400 text-white w-full' : 'w-full'}
                                                onClick={() => {
                                                    setSelectedBid(bid)
                                                    handleConfirmOpen()
                                                }}
                                            >
                                                Согласовать
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </ScrollArea>

                    <div className='flex gap-3 fixed bottom-3 px-4 py-6 text-[24px] left-1/2 -translate-x-1/2 w-full'>
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

                    {confirmOpen && (
                        <Modal className='rounded-lg w-[95%]' isOpen={confirmOpen} onClose={handleConfirmClose}>
                            <div className='p-4'>
                                <h2 className='text-lg font-semibold mb-4'>Вы уверены, что хотите согласовать?</h2>
                                <div className='flex gap-4 items-center justify-center'>
                                    <Button variant='secondary' onClick={handleConfirmClose}>
                                        Отмена
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (selectedBid?.id) {
                                                handleApprove(selectedBid.id)
                                            }   
                                            handleConfirmClose()
                                        }}
                                    >
                                        Подтвердить
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            ) : (
                <div className="text-center p-8">
                    <p>Нет доступных заявок</p>
                </div>
            )}
        </div>
    )
}

export default BidsTableMobile
