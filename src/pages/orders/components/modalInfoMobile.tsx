import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Download, MapPin } from 'lucide-react'
import { IOrder } from '@/types'
import React from 'react'

interface ShippingOrderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedOrder: IOrder
    handleCloseModal: () => void
}

export function ShippingOrderDialog({ open, onOpenChange, selectedOrder, handleCloseModal }: ShippingOrderDialogProps) {
    console.log('selectedBid', selectedOrder)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-full h-full p-0 gap-0'>
                <div className='flex items-center gap-2 bg-[#00BCD4] text-white p-4 sticky top-0'>
                    <Button variant='ghost' size='icon' className='hover:bg-white/20' onClick={handleCloseModal}>
                        <ChevronLeft className='h-6 w-6' />
                    </Button>
                    <h2 className='text-lg font-medium'>Заказ №{selectedOrder._id}</h2>
                </div>

                <div className='overflow-y-auto flex-1'>
                    <div className='flex flex-col'>
                        <div className='text-center bg-gray-100 p-2'>
                            <h3 className='font-bold text-[#1E293B] text-[22px] '>Контейнер Погрузка</h3>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Статус заказа</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.status}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px]  px-6 py-2 '>
                            <p className='text-gray-600'>Автор статуса</p>
                            <p className='font-bold text-[#1E293B]'>Сидоров С.К.</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600 '>Дата погрузки</p>
                            <p className='font-bold text-[#1E293B]'>
                                {new Date(selectedOrder?.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px]   px-6 py-2 '>
                            <p className='text-gray-600'>Срок доставки</p>
                            <p className='font-bold text-[#1E293B]'>04.02.2025</p>
                        </div>
                    </div>

                    <div className='flex overflow-auto gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                        <p className='text-gray-600'>Маршрут</p>
                        <p className='font-bold text-[#1E293B]'>
                            {selectedOrder.buyBid?.terminal1.cityName} - {selectedOrder.buyBid?.terminal2?.cityName}
                        </p>
                    </div>

                    <div className='mt-4  space-y-2'>
                        <div className='border-b-2 border-[#E6E6E6]  px-6 py-2'>
                            <p className='text-gray-600'>Получить контейнер:</p>
                            <p className='font-bold flex gap-1 items-center text-[18px] text-[#1E293B]'>
                                <MapPin className='max-h-[20px] min-h-[20px]' />
                                {selectedOrder.buyBid?.terminal1.address}
                            </p>
                        </div>
                        <div className='border-b-2 border-[#E6E6E6]  px-6 py-2'>
                            <p className='text-gray-600'>Адрес погрузки:</p>
                            <p className='font-bold text-[18px] flex gap-1 items-center text-[#1E293B]'>
                                {' '}
                                <MapPin />
                                {selectedOrder?.buyBid?.warehouses[0]?.cityName},{' '}
                                {selectedOrder?.buyBid?.warehouses[0]?.address || 'Адрес не указан'}
                            </p>
                        </div>
                        <div className='border-b-2 border-[#E6E6E6]  px-6 py-2'>
                            <p className='text-gray-600'>Сдать контейнер:</p>
                            <p className='font-bold flex gap-1 text-[18px] items-center text-[#1E293B]'>
                                <MapPin /> {selectedOrder.buyBid?.terminal2?.address}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className='flex gap-6 items-center text-[18px]  px-6 py-2 '>
                            <p className='text-gray-600'>Время подачи</p>
                            <p className='font-bold text-[#1E293B]'>16:00</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Транспорт</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.buyBid?.vehicleProfile?.name}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px]  px-6 py-2 '>
                            <p className='text-gray-600'>Машина</p>
                            <p className='font-bold text-[#1E293B]'>
                                {selectedOrder.assignedVehicle?.docModel} {selectedOrder.assignedVehicle?.plateNum}
                            </p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] px-6 py-2 '>
                            <p className='text-gray-600'>Прицеп</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.assignedTrailer?.plateNum}</p>
                        </div>
                    </div>

                    <div className='mt-4 space-y-2'>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Водитель</p>
                            <p className='font-bold text-[#1E293B]'>Иванов Иван Иванич</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] px-6 py-2 '>
                            <p className='text-gray-600'>E-mail</p>
                            <p className='font-bold text-[#1E293B]'>ivanov@mail.ru</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] px-6 py-2 '>
                            <p className='text-gray-600'>Телефон</p>
                            <p className='font-bold text-[#1E293B]'>+7(999)123-45-67</p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Груз</p>
                            <p className='font-bold text-[#1E293B]'>Хрустальные вазы</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] px-6 py-2 '>
                            <p className='text-gray-600'>Комментарии заказчика</p>
                            <p className='font-bold text-[#1E293B]'>-</p>
                        </div>
                        <div>
                            <h3 className='font-medium bg-[#E6E6E6] px-6 py-2 text-[18px]'>Финансы:</h3>
                            <div className='grid grid-cols-3 gap-2 px-6 py-2 text-[18px]'>
                                <div className='font-bold text-[#1E293B] text-left mb-8'>Услуга</div>
                                <div className='font-bold text-[#1E293B] text-center mb-8'>Кол-во</div>
                                <div className='font-bold text-[#1E293B] text-right mb-8'>Цена</div>

                                <div>Перевозка</div>
                                <div className='text-center'>-</div>
                                <div className='text-right font-bold text-[#1E293B]'>{selectedOrder.price}</div>
                                {selectedOrder?.extraServices?.map((service, index) => (
                                    <React.Fragment key={index}>
                                        <div>{service.name}</div>
                                        <div className='text-center font-bold text-[#1E293B]'>{service.count}</div>
                                        <div className='text-right font-bold text-[#1E293B]'>{service.totalPrice}</div>
                                    </React.Fragment>
                                ))}

                                <div className='col-span-2 font-bold text-[#1E293B]'>ИТОГО СУММА ЗАКАЗ</div>
                                <div className='font-bold text-[#1E293B] text-right'>{selectedOrder.fullPrice}</div>
                            </div>
                        </div>
                    </div>

                    <h3 className='font-medium bg-[#E6E6E6] px-6 py-2 text-[18px]'>Контакты сторон:</h3>
                    <div className='mt-4 space-y-2'>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Перевозчик</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.carrier?.organizationName}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>ИНН</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.carrier?.inn}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Контактное лицо</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.carrier?.fio}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Ответственный</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.carrier?.fio}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Раб. телефон</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.carrier?.phone}</p>
                        </div>

                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Почта</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder?.carrier?.email}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Заказчик</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder?.customer?.organizationName}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>ИНН</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder?.customer?.inn}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Ответственный</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.customer?.fio}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Раб. телефон</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.customer?.phone}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] border-b-2  border-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Почта</p>
                            <p className='font-bold text-[#1E293B]'>{selectedOrder.customer?.email}</p>
                        </div>
                    </div>

                    <h3 className='font-medium bg-[#E6E6E6] px-6 py-2 text-[18px]'>Атрибуты договора:</h3>
                    <div className='flex gap-6 items-center text-[18px] px-6 py-2 '>
                        <p className='font-bold text-[#1E293B]'>Заказ №{selectedOrder._id}</p>
                    </div>

                    <div className='space-y-2 px-6'>
                        <Button className='w-full flex gap-2' variant='outline'>
                            <Download className='h-4 w-4' />
                            Скачать заказ (PDF)
                        </Button>
                        <Button className='w-full' variant='outline' color='red'>
                            Отмена подачи
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
