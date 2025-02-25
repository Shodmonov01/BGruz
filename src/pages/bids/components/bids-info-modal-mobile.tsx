import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface ShippingOrderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedBid: any
    handleCloseModal: () => void
}

export function BidsOrderDialog({ open, onOpenChange, selectedBid, handleCloseModal }: ShippingOrderDialogProps) {
    const [isReadOnly, _] = useState<boolean>(true)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU')
    }

    const handleSave = async () => {
        console.log('сохранён')
    }
    const handleEdit = () => {
        console.log('edited')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-full h-full p-0 gap-0'>
                <div className='flex items-center gap-2 bg-[#00BCD4] text-white p-4 sticky top-0'>
                    <Button variant='ghost' size='icon' className='hover:bg-white/20' onClick={handleCloseModal}>
                        <ChevronLeft className='h-6 w-6' />
                    </Button>
                    <h2 className='text-lg font-medium'>Заявка №{selectedBid.number}</h2>
                </div>

                <div className='overflow-y-auto flex-1'>
                    <div className='flex flex-col'>
                        <div className='text-center text-[18px] flex flex-col justify-center items-center bg-gray-100 p-2'>
                            <RadioGroup defaultValue={selectedBid.loadingMode} className='flex gap-6 mt-2'>
                                <div className='flex items-center mb-3'>
                                    <Label className='text-[#1E293B] text-[18px] font-bold mr-3' htmlFor='loading'>
                                        Погрузка
                                    </Label>
                                    <RadioGroupItem
                                        className=' size-5'
                                        value='loading'
                                        id='loading'
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className='flex items-center gap-2  mb-3'>
                                    <RadioGroupItem
                                        className=' size-5'
                                        value='unloading'
                                        id='unloading'
                                        disabled={isReadOnly}
                                    />
                                    <Label className='text-[#1E293B] text-[18px] font-bold' htmlFor='unloading'>
                                        Выгрузка
                                    </Label>
                                </div>
                            </RadioGroup>
                            <RadioGroup defaultValue={selectedBid.cargoType} className='flex gap-6 mt-2 '>
                                <div className='flex items-center  relative -left-5 mb-2'>
                                    <Label className='text-[#1E293B] text-[18px] font-bold mr-2' htmlFor='container'>
                                        Контейнер
                                    </Label>
                                    <RadioGroupItem
                                        className=' size-5'
                                        value='container'
                                        id='container'
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className='flex items-center gap-2  relative -left-5 mb-2'>
                                    <RadioGroupItem
                                        className=' size-5'
                                        value='wagon'
                                        id='wagon'
                                        disabled={isReadOnly}
                                    />
                                    <Label className='text-[#1E293B] text-[18px] font-bold' htmlFor='wagon'>
                                        Вагон
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Статус заказа</p>
                            <p className='font-bold text-[#1E293B]'>{selectedBid.status}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px]  px-6 py-2 '>
                            <p className='text-gray-600'>Автор статуса</p>
                            <p className='font-bold text-[#1E293B]'>{selectedBid.createdBy}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600 '>Дата погрузки</p>
                            <p className='font-bold text-[#1E293B]'>{formatDate(selectedBid.loadingDate)}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px]   px-6 py-2 '>
                            <p className='text-gray-600'>Срок доставки</p>
                            <p className='font-bold text-[#1E293B]'>
                                {selectedBid.dueDate ? formatDate(selectedBid.dueDate) : 'Не указан'}
                            </p>
                        </div>
                    </div>

                    <div className='flex overflow-auto gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                        <p className='text-gray-600'>Маршрут</p>
                        <p className='font-bold text-[#1E293B]'>
                            {selectedBid.terminal1.cityName} - {selectedBid.terminal2?.cityName}
                        </p>
                    </div>

                    <div className='mt-4  space-y-2'>
                        <div className='border-b-2 border-[#E6E6E6]  px-6 py-2'>
                            <p className='text-gray-600'>Получить контейнер:</p>
                            <p className='font-bold flex gap-1 items-start text-[18px] text-[#1E293B]'>
                                <span>
                                    <MapPin className='max-h-[20px] min-h-[20px] size-5 mt-1 text-[#03B4E0]' />
                                </span>
                                {selectedBid.terminal1.address}
                            </p>
                        </div>
                        <div className='border-b-2 border-[#E6E6E6]  px-6 py-2'>
                            <p className='text-gray-600'>Адрес погрузки:</p>
                            <p className='font-bold text-[18px] flex gap-1 items-start text-[#1E293B]'>
                                {' '}
                                <span>
                                    <MapPin className='max-h-[20px] min-h-[20px] size-5 mt-1 text-[#03B4E0]' />
                                </span>
                                {selectedBid.warehouses[0]?.cityName},{' '}
                                {selectedBid.warehouses[0]?.address || 'Адрес не указан'}
                            </p>
                        </div>
                        <div className='border-b-2 border-[#E6E6E6]  px-6 py-2'>
                            <p className='text-gray-600'>Сдать контейнер:</p>
                            <p className='font-bold flex gap-1 text-[18px] items-start text-[#1E293B]'>
                                <span>
                                    <MapPin className='max-h-[20px] min-h-[20px] size-5 mt-1 text-[#03B4E0]' />
                                </span>{' '}
                                {selectedBid.terminal2?.address}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className='flex gap-6 items-center text-[18px]  px-6 py-2 '>
                            <p className='text-gray-600'>Время подачи</p>
                            <p className='font-bold text-[#1E293B]'>{selectedBid.filingTime}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Транспорт</p>
                            <p className='font-bold text-[#1E293B]'>{selectedBid.vehicleProfile?.name}</p>
                        </div>
                        <div className='flex gap-6 items-center text-[18px]  px-6 py-2 '>
                            <p className='text-gray-600'>Количество:</p>
                            <p className='font-bold text-[#1E293B]'>{selectedBid.vehicleCount}</p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <div className='flex gap-6 items-center text-[18px] bg-[#E6E6E6] px-6 py-2 '>
                            <p className='text-gray-600'>Груз</p>
                            <p className='font-bold text-[#1E293B]'>{selectedBid.cargoTitle || ''}</p>
                        </div>
                        <div className='flex gap-6 items-center px-6 py-2 '>
                            <p className='text-gray-600 text-[16px] '>Комментарии заказчика</p>
                            <p className='font-bold text-[18px]  text-[#1E293B]'>{selectedBid.description || '-'}</p>
                        </div>
                        <div>
                            <h3 className='font-medium bg-[#E6E6E6] px-6 py-2 text-[18px]'>Финансы:</h3>
                            <div className='grid grid-cols-3 gap-2 px-6 py-2 text-[18px]'>
                                <div className='font-bold text-[#1E293B] text-left mb-8'>Услуга</div>
                                <div className='font-bold text-[#1E293B] text-center mb-8'>Кол-во</div>
                                <div className='font-bold text-[#1E293B] text-right mb-8'>Цена</div>

                                <div>Перевозка</div>
                                <div className='text-center'>-</div>
                                <div className='text-right font-bold text-[#1E293B]'>{selectedBid.price}</div>
                                {selectedBid?.extraServices?.map((service, index) => (
                                    <React.Fragment key={index}>
                                        <div>{service.name}</div>
                                        <div className='text-center'>{service.count}</div>
                                        <div className='text-right font-bold text-[#1E293B]'>{service.price}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className='w-full flex items-center text-[18px] justify-between px-6 py-2 '>
                                <div className='col-span-2 font-bold text-[#1E293B]'>ИТОГО СУММА ЗАКАЗ</div>
                                <div className='font-bold text-[#1E293B] text-right'>{selectedBid.fullPrice}</div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col justify-center gap-4 py-6 px-4'>
                        <Button
                            // disabled={isReadOnly}
                            onClick={handleSave}
                            className='bg-orange-500 hover:bg-orange-600 text-white'
                        >
                            Сохранить изменения
                        </Button>
                        <Button  className='bg-orange-500 hover:bg-orange-600 text-white'>
                            Сохранить заявку как новую
                        </Button>
                        <Button onClick={handleEdit} className='bg-orange-500 hover:bg-orange-600 text-white'>
                            Редактировать
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
