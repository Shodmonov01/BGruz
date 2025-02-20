import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import info from '../../../../public/info.svg'
import PopupModal from '@/components/shared/popup-modal'
import StudentCreateForm from './bid-create-form'
import { BidsOrderDialog } from './bids-info-modal-mobile'
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
    const [_, setIsModalOpen] = useState(false)
    const [open, setOpen] = useState(false)

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setOpen(false)
    }, [])

    const handleOpenModal = useCallback(order => {
        setSelectedBid(order)
        setOpen(true)
    }, [])

    return (
        <div className='flex flex-col gap-4 '>
            <ScrollArea className='flex flex-col gap-4 max-h-[87vh] w-full overflow-auto rounded-md border'>
                {bids.map(bid => (
                    <Card key={bid.persistentId} className='p-4 shadow-md rounded-lg'>
                        <CardContent className='w-full !p-0 flex items-center gap-2 '>
                            <div onClick={() => handleOpenModal(bid)}>
                                <img src={info} alt='' className='h-14' />
                            </div>
                            <div className='flex flex-col justify-center gap-[1px]'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                                </div>
                                <div className='ml-[2.5px] w-[2px] h-[70px] bg-gray-300'></div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-lg font-semibold'>{bid.terminal1.cityName}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Количество машин: 1</span>

                                    {/* <span className='font-medium'>Сумма:</span>
                                <span className='text-green-600 font-semibold'>
                                    {bid.price ? `${bid.price} ₽` : '—'}
                                </span> */}
                                </div>
                                <div className='flex justify-between'>
                                    <span className='zfont-semibold'>{bid.vehicleProfile?.name || '—'}</span>
                                </div>
                                <div>
                                    <span className='text-lg font-semibold'>{bid.terminal2.cityName}</span>
                                </div>
                                {/* <Button onClick={() => handleOpenModal(bid)} className='mt-2 w-full'>
                                Подробнее
                            </Button> */}
                            </div>
                            <div className='ml-auto'>
                                <span className='text-green-600 font-semibold'>
                                    {bid.price ? `${bid.price} ₽` : '—'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </ScrollArea>

            <div className='flex gap-3 fixed bottom-10 px-12 py-6 text-[24px] left-1/2 -translate-x-1/2'>
                <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
            </div>

            {selectedBid && (
                <BidsOrderDialog
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
