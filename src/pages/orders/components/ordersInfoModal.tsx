import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { postData2 } from '@/api/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function OrderInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const [formData, _] = useState({ ...selectedBid })

    // const handleChange = e => {
    //     const { name, value } = e.target
    //     setFormData(prev => ({ ...prev, [name]: value }))
    // }

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')
        try {
            await postData2(`api/v1/bids/${formData._id}`, formData, token)
            alert('Заявка успешно обновлена!')
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
        }
    }
    console.log('selectedBid11', selectedBid)

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTrigger asChild>
                <Button variant='outline'>Open Order</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <span className='rounded bg-orange-500 px-2 py-1 text-sm text-white'>Груз сдан</span>
                            <span>CM ID 47</span>
                            <span className='text-xl font-semibold'>Заказ</span>
                            <span>
                                ID {formData._id} от {new Date(formData.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <div className='grid gap-6'>
                    <div className='flex justify-between'>
                        <div className='flex justify-between items-center gap-4'>
                            <p>Статус заказа:</p>
                            <p>{formData.status}</p>
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p>Изменено</p>
                            <p>{new Date(formData.statusUpdated).toLocaleString('ru-RU')}</p>
                        </div>
                    </div>

                    <div className='flex justify-between items-center '>
                        <div className='flex justify-between items-center gap-4'>
                            <p>Документы сданы:</p>
                            <p>
                                {formData.docSubmissionDate
                                    ? new Date(formData.docSubmissionDate).toLocaleString('ru-RU')
                                    : 'Не сданы'}
                            </p>
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p>Изменено</p>
                            <p>
                                {formData.docSubmissionUserId ? 'ID: ' + formData.docSubmissionUserId : 'Не изменено'}
                            </p>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-between'>
                        <div>
                            <p className=' font-bold'>
                                Дата погрузки {new Date(formData.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                        <div>
                            <p className=' font-bold'>
                                Дата погрузки {new Date(formData.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                    </div>

                    <div className='flex  items-center gap-4'>
                        <p>Тип перевозки</p>
                        <p>{formData.buyBid.cargoType}</p>
                        <p>{formData.buyBid.loadingMode}</p>
                    </div>

                    <div className='flex justify-between items-center '>
                        <div className='flex justify-between items-center gap-4'>
                            <p>Время подачи</p>
                            <p>09:00</p>
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p>Профиль ТС</p>
                            <p>{formData.buyBid.vehicleProfile.name}</p>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Маршрут</p>
                    </div>

                    <div>
                        <p className='text-[18px] text-bold'>Терминал 1</p>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Input value={formData.buyBid.terminal1.cityName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Input value={formData.buyBid.terminal1.address || ''} className='mt-1' readOnly />
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className='text-[18px] text-bold'>Склад клиента</p>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Input value={formData.buyBid.warehouses[0].cityName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Input value={formData.buyBid.warehouses[0].address || ''} className='mt-1' readOnly />
                                <div className='flex justify-between items-center text-[#A7A7A7]'>
                                    <p>Иванов Иван Иваныч</p>
                                    <p>+ (999)123-45-36</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className='text-[18px] text-bold'>Терминал 2</p>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Input value={formData.buyBid.terminal2.cityName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Input value={formData.buyBid.terminal2.address || ''} className='mt-1' readOnly />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-between'>
                        <p className='text-[20px] font-bold'>Транспорт</p>
                        <p>{formData.buyBid.vehicleProfile.name}</p>
                    </div>

                    <div className='flex justify-between'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p>Водитель</p>
                                <input
                                    type='text'
                                    value={formData.assignedVehicle.driverName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Машина</p>
                                <input
                                    type='text'
                                    value={formData.assignedVehicle.plateNum}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Прицеп</p>
                                <input
                                    type='text'
                                    value={formData.assignedTrailer.plateNum}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p>Файлы</p>
                                <input
                                    type='text'
                                    value='Ссылка на файл'
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Файлы</p>
                                <input
                                    type='text'
                                    value='Ссылка на файл'
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Файлы</p>
                                <input
                                    type='text'
                                    value='Ссылка на файл'
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex flex-col py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Финансы</p>
                        <p>Все цены указаны без НДС</p>
                    </div>

                    <div className='shadow-none border-0'>
                        <div className='grid gap-4 pt-6'>
                            <div className='grid gap-4'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-[18px] font-bold mb-3'>Перевозка</p>
                                    </div>
                                    <div>
                                        <p className='text-[18px] font-bold mb-3'>Цена с НДС</p>
                                        <Input value={formData.priceNds.toFixed(2)} placeholder='Цена с НДС' readOnly />
                                    </div>
                                    <div>
                                        <p className='text-[18px] font-bold mb-3'>Цена без НДС</p>
                                        <Input value={formData.price.toFixed(2)} placeholder='Цена без НДС' readOnly />
                                    </div>
                                </div>
                                <div>
                                    <p className='text-[18px] font-bold mb-3'>Доп услуги</p>
                                    <div className='flex flex-col gap-3'>
                                        {formData.extraServices.map((service, index) => (
                                            <div key={index} className='space-y-2'>
                                                <div className='flex items-center gap-2'>
                                                    <Checkbox
                                                        id={`service-${index}`}
                                                        checked={service.billableCount > 0}
                                                    />
                                                    <label className='w-full' htmlFor={`service-${index}`}>
                                                        {service.name}
                                                    </label>
                                                    <Input
                                                        type='number'
                                                        className='w-20'
                                                        value={service.count}
                                                        readOnly
                                                    />
                                                    <Input value={service.priceNds.toFixed(2)} readOnly />
                                                    <Input value={service.price.toFixed(2)} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <p className=' font-bold mb-3 w-full'>Полная стоимость рейса без НДС</p>
                            <Input
                                value={formData.fullPriceNds.toFixed(2)}
                                placeholder='Полная стоимость с НДС'
                                readOnly
                            />
                            <Input
                                value={formData.fullPrice.toFixed(2)}
                                placeholder='Полная стоимость без НДС'
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <p className=' text-bold'>Груз</p>
                                <Input value={formData.terminal1?.cityName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <p className=' text-bold'>Стоимость груза</p>
                                <Input value={formData.terminal1?.address || ''} className='mt-1' readOnly />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='pt-6'>
                            <div className='grid gap-2'>
                                <Label>Комментарии</Label>
                                <Textarea placeholder='Комментарии к грузу' />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Контакты сторон</p>
                    </div>

                    <div className='flex justify-between'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p>Заказчик</p>
                                <input
                                    type='text'
                                    value={formData.customer.organizationName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>ИНН</p>
                                <input
                                    type='text'
                                    value={formData.customer.inn}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Раб телефон</p>
                                <input
                                    type='text'
                                    value={formData.customer.organizationPhone}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p>Отвественный</p>
                                <input
                                    type='text'
                                    value={formData.customer.fio}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Телефон</p>
                                <input
                                    type='text'
                                    value={formData.customer.phone}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Почта</p>
                                <input
                                    type='text'
                                    value={formData.customer.email}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p>Заказчик</p>
                                <input
                                    type='text'
                                    value={formData.carrier.organizationName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>ИНН</p>
                                <input
                                    type='text'
                                    value={formData.carrier.inn}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Раб телефон</p>
                                <input
                                    type='text'
                                    value={formData.carrier.organizationPhone}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p>Отвественный</p>
                                <input
                                    type='text'
                                    value={formData.carrier.fio}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Телефон</p>
                                <input
                                    type='text'
                                    value={formData.carrier.phone}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Почта</p>
                                <input
                                    type='text'
                                    value={formData.carrier.email}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Приклепленные файлы</p>
                    </div>

                    <div className='flex flex-col'>
                        {formData.assignedVehicleFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                {file.name}
                            </a>
                        ))}
                        {formData.assignedTrailerFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                {file.name}
                            </a>
                        ))}
                        {formData.assignedDriverFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                {file.name}
                            </a>
                        ))}
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Сформированные документы</p>
                    </div>

                    {formData.documentOrderItems.map((doc, index) => (
                        <div key={index} className='flex'>
                            <p className='text-[16px] font-bold'>{doc.DisplayName}</p>
                            <div className='ml-3 flex gap-2'>
                                <a href={doc.URI_HTML}>HTML</a>
                                <a href={doc.URI_PDF}>PDF</a>
                                <a href={doc.URI_PDF_Download}>Скачать</a>
                            </div>
                        </div>
                    ))}

                    <div className='flex justify-end'>
                        <Button size='lg' className='bg-orange-500 hover:bg-orange-600' onClick={handleCloseModal}>
                            Закрыть
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderInfoModal
