import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import useNumberFormatter from '@/hooks/use-format-number'
import { OrderRoute } from './info-modal-details/order-route'
import { OrderHeader } from './info-modal-details/order-header'
import { OrderFinancial } from './info-modal-details/order-financial'
import { OrderContacts } from './info-modal-details/order-contacts'

// const statusTranslations = {
//     new: 'Новый',
//     canceledByCarrierWithPenalty: 'Отменяется перевозчиком (половина ГО)',
//     canceledByCustomerWithPenalty: 'Отменяется заказчиком (половина ГО)',
//     canceledByCarrier: 'Отменяется перевозчиком',
//     canceledByCustomer: 'Отменяется заказчиком',
//     failed: 'Сорван',
//     failing: 'Срывается',
//     completed: 'Выполнен',
//     inTransit: 'Машина в пути',
//     canceled: 'Отменен',
//     headingToLoading: 'Еду на погрузку',
//     loading: 'На погрузке',
//     unloading: 'На выгрузке',
//     delivered: 'Груз сдан'
// }

function OrderInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const { formatNumber } = useNumberFormatter()
    const [formData, setFormData] = useState({
        ...selectedBid
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    console.log('selectedBid', selectedBid)

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTrigger asChild>
                <Button variant='outline'>Open Order</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-[1000px] overflow-y-auto !p-0'>
                <OrderHeader formData={formData} handleChange={handleChange} setFormData={setFormData} />

                <div className='grid gap-6'>
                    <OrderRoute formData={formData} />
                    <OrderFinancial formData={formData} formatNumber={formatNumber} setFormData={setFormData} />
                    <OrderContacts formData={formData} />

                    <div className='flex justify-center gap-4 py-6'>
                        <Button className='bg-orange-500 hover:bg-orange-600 text-white' onClick={handleCloseModal}>
                            Закрыть
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderInfoModal
