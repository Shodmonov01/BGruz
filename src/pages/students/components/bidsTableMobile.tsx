import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BidsInfoModal from './bids-info-modal'
import { useCallback, useState } from 'react'
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
    customer?: { name: string }
    terminal1?: { cityName: string }
    terminal2?: { cityName: string }
    warehouses?: { cityName: string }[]
    vehicleProfile?: { name: string }
    [key: string]: unknown 
}

function BidsTableMobile({ bids }) {
    const [selectedBid, setSelectedBid] = useState<Partial<Bid> | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedBid(null)
    }, [])

    const handleOpenModal = useCallback((bid: Bid) => {
        setSelectedBid(bid)
        setIsModalOpen(true)
    }, [])
    return (
        <div className='flex flex-col gap-4 p-4'>
            {bids.map(bid => (
                <Card key={bid.persistentId} className='p-4 shadow-md rounded-lg'>
                    <CardContent className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <span className='text-lg font-semibold'>
                                {bid.terminal1.cityName} → {bid.terminal2.cityName}
                            </span>
                            <span className='text-sm text-gray-500'>
                                {new Date(bid.filingTime).toLocaleDateString()}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Сумма:</span>
                            <span className='text-green-600 font-semibold'>{bid.price ? `${bid.price} ₽` : '—'}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Статус:</span>
                            <span className='text-blue-500 font-semibold'>{bid.status || '—'}</span>
                        </div>
                        <Button onClick={() => handleOpenModal( bid)} className='mt-2 w-full'>
                            Подробнее
                        </Button>
                    </CardContent>
                </Card>
            ))}

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

export default BidsTableMobile
