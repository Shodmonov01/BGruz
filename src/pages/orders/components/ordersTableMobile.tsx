import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import info from '../../../../public/info.svg'
import { IOrder } from '@/types'
import { ShippingOrderDialog } from './modalInfoMobile'
import useNumberFormatter from '@/hooks/use-format-number'

function OrderTableMobile({ orders }) {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
    const [_, setIsModalOpen] = useState(false)
    const [open, setOpen] = useState(false)

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setOpen(false)
    }, [])

    const handleOpenModal = useCallback((order: IOrder) => {
        setSelectedOrder(order)
        setOpen(true)
    }, [])

    const { formatNumber } = useNumberFormatter()


    return (
        <div className='flex flex-col gap-4 '>
            <ScrollArea className='flex flex-col gap-4 max-h-[87vh] w-full overflow-auto rounded-md border'>
                {orders.map(order => (
                    <Card key={order._id} className='p-4 shadow-md rounded-lg cursor-pointer'>
                        <CardContent className='w-full !p-0 flex items-center gap-2 '>
                            <div onClick={() => handleOpenModal(order)}>
                                <img src={info || '/placeholder.svg'} alt='' className='h-14' />
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
                                    <span className='text-lg font-semibold'>{order.buyBid.terminal1.cityName}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Количество машин: 1</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-semibold'>{order.buyBid.vehicleProfile?.name || '—'}</span>
                                </div>
                                <div>
                                    <span className='text-lg font-semibold'>{order.buyBid.terminal2?.cityName}</span>
                                </div>
                            </div>
                            <div className='ml-auto'>
                                <span className='text-green-600 font-semibold'>
                                    {order.price ? `${formatNumber(order.price)} ₽` : '—'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </ScrollArea>
            {selectedOrder && (
                <ShippingOrderDialog
                    handleCloseModal={handleCloseModal}
                    open={open}
                    onOpenChange={setOpen}
                    selectedOrder={selectedOrder}
                />
            )}
        </div>
    )
}

export default OrderTableMobile
