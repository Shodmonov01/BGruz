import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { postData2 } from '@/api/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function OrderInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const [formData, setFormData] = useState({
        ...selectedBid
    })
    console.log('formData', formData)

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    {
        /* @ts-expect-error что нибудь придумаем */
    }
    // const handleSave = async () => {
    //     const token = localStorage.getItem('authToken')
    //     try {
    //         await postData2(`api/v1/bids/${formData._id}`, formData, token)
    //         alert('Заявка успешно обновлена!')
    //         handleCloseModal()
    //     } catch (error) {
    //         console.error('Ошибка при обновлении заявки:', error)
    //     }
    // }

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')
        try {
            const updatedData = {
                ...formData
            }
            await postData2(`api/v1/orders/${formData._id}`, updatedData, token)
            alert('Заявка успешно обновлена!')
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
        }
    }

    // const handleSave = async () => {
    //     const token = localStorage.getItem('authToken')
    //     try {
    //         const updatedData = {
    //             price: formData.price,
    //             extraServices: formData.extraServices.map((service) => ({
    //                 billableCount: service.count,
    //               })),
    //         }
    //         await postData2(`api/v1/orders/${formData._id}`, updatedData, token)
    //         alert('Заявка успешно обновлена!')
    //         handleCloseModal()
    //     } catch (error) {
    //         console.error('Ошибка при обновлении заявки:', error)
    //     }
    // }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTrigger asChild>
                <Button variant='outline'>Open Order</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <div className=''>
                        <div className='mb-6'>
                            <span className='rounded bg-orange-500 px-4 py-2 text-sm text-white '>Груз сдан</span>
                        </div>
                        <div className='flex items-center justify-between gap-4 mb-4'>
                            <span className='text-[#03B4E0] font-semibold'>CM ID 47</span>
                            <span className='text-[30px] text-[#EE6F2D] border-x-2 px-14 border-[#EE6F2D] font-bold'>
                                Заказ
                            </span>
                            <span className='text-[#03B4E0] font-semibold'>
                                ID {formData._id} от {new Date(formData.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <div className='bg-cyan-500 flex py-2 px-4 text-white '>
                    <div>
                        <p className=' font-bold'>Статус заказа</p>
                    </div>
                </div>

                <div className='grid gap-6'>
                    <div className='flex justify-between'>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold'>Статус заказа:</p>
                            <input
                                type='text'
                                name='status'
                                value={formData.status}
                                onChange={handleChange}
                                className='border border-gray-300 rounded px-2 py-1'
                            />
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold'>Изменено</p>
                            <p>{new Date(formData.statusUpdated).toLocaleString('ru-RU')}</p>
                        </div>
                    </div>

                    <div className='flex justify-between items-center '>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold'>Документы сданы:</p>
                            <p>
                                {formData.docSubmissionDate
                                    ? new Date(formData.docSubmissionDate).toLocaleString('ru-RU')
                                    : 'Не сданы'}
                            </p>
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold'>Изменено</p>
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
                        <p className='font-bold'>Тип перевозки</p>
                        <p>{formData.buyBid.cargoType}</p>
                        <p>{formData.buyBid.loadingMode}</p>
                    </div>

                    <div className='flex justify-between items-center '>
                        <div className='flex justify-between items-center gap-4'>
                            <p className=' font-bold'>Время подачи</p>
                            <p>09:00</p>
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p className=' font-bold'>Профиль ТС</p>
                            <p>{formData.buyBid.vehicleProfile.name}</p>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Маршрут</p>
                    </div>

                    <div>
                        <p className='text-[18px] font-bold'>Терминал 1</p>
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
                        <p className='text-[18px] font-bold'>Склад клиента</p>
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
                        <p className='text-[18px] font-bold'>Терминал 2</p>
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
                                <p className='font-bold'>Водитель</p>
                                <input
                                    type='text'
                                    value={formData.assignedVehicle.driverName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Машина</p>
                                <input
                                    type='text'
                                    value={formData.assignedVehicle.plateNum}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Прицеп</p>
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
                                <p className='font-bold'>Файлы</p>
                                <input
                                    type='text'
                                    value='Ссылка на файл'
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Файлы</p>
                                <input
                                    type='text'
                                    value='Ссылка на файл'
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Файлы</p>
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
                                                        className='font-bold'
                                                        id={`service-${index}`}
                                                        checked={service.count > 0}
                                                        onCheckedChange={checked => {
                                                            const newExtraServices = [...formData.extraServices]
                                                            newExtraServices[index] = {
                                                                ...service,
                                                                count: checked ? 1 : 0
                                                            }
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                extraServices: newExtraServices
                                                            }))
                                                        }}
                                                    />
                                                    <label
                                                        className='min-w-[220px] font-bold'
                                                        htmlFor={`service-${index}`}
                                                    >
                                                        {service.name}
                                                    </label>
                                                    <Input
                                                        type='number'
                                                        className='w-20'
                                                        value={service.count}
                                                        onChange={e => {
                                                            const newExtraServices = [...formData.extraServices]
                                                            newExtraServices[index] = {
                                                                ...service,
                                                                count: Number.parseInt(e.target.value) || 0
                                                            }
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                extraServices: newExtraServices
                                                            }))
                                                        }}
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
                            <p className=' font-bold w-full min-w-[300px]'>Полная стоимость рейса без НДС</p>
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
                                <p className='font-bold'>Груз</p>
                                <Input
                                    placeholder='Название груза'
                                    value={formData.terminal1?.cityName || ''}
                                    className='mt-1'
                                    readOnly
                                />
                            </div>
                            <div>
                                <p className=' font-bold'>Стоимость груза</p>
                                <Input name='price' value={formData.price} onChange={handleChange} className='mt-1' />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='pt-6'>
                            <div className='grid gap-2 '>
                                <Label className='font-bold'>Комментарии</Label>
                                <Textarea className='h-[148px]' placeholder='Комментарии к грузу' />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Контакты сторон</p>
                    </div>

                    <div className='flex justify-between'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Заказчик</p>
                                <input
                                    type='text'
                                    value={formData.customer.organizationName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>ИНН</p>
                                <input
                                    type='text'
                                    value={formData.customer.inn}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Раб телефон</p>
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
                                <p className='font-bold'>Отвественный</p>
                                <input
                                    type='text'
                                    value={formData.customer.fio}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Телефон</p>
                                <input
                                    type='text'
                                    value={formData.customer.phone}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Почта</p>
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
                                <p className='font-bold'>Заказчик</p>
                                <input
                                    type='text'
                                    value={formData.carrier.organizationName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>ИНН</p>
                                <input
                                    type='text'
                                    value={formData.carrier.inn}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Раб телефон</p>
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
                                <p className='font-bold'>Отвественный</p>
                                <input
                                    type='text'
                                    value={formData.carrier.fio}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Телефон</p>
                                <input
                                    type='text'
                                    value={formData.carrier.phone}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm flex justify-center items-center'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Почта</p>
                                <input
                                    type='text'
                                    value={formData.carrier.email}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm flex justify-center'
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Приклепленные файлы</p>
                    </div>

                    <div className='flex flex-col text-[#03B4E0] font-bold underline'>
                        {formData.assignedVehicleFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                Ссылка
                            </a>
                        ))}
                        {formData.assignedTrailerFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                Ссылка
                            </a>
                        ))}
                        {formData.assignedDriverFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                Ссылка
                            </a>
                        ))}
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-4 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Сформированные документы</p>
                    </div>

                    {formData.documentOrderItems.map((doc, index) => (
                        <div key={index} className='flex'>
                            <p className='text-[16px] font-bold'>{doc.DisplayName}</p>
                            <div className='ml-3 flex text-[#03B4E0] font-bold underline gap-2'>
                                <a className='' href={doc.URI_HTML}>
                                    HTML
                                </a>
                                <a href={doc.URI_PDF}>PDF</a>
                                <a href={doc.URI_PDF_Download}>Скачать</a>
                            </div>
                        </div>
                    ))}

                    <div className='flex justify-center gap-4 py-6'>
                        <Button onClick={handleSave} className='bg-orange-500 hover:bg-orange-600 text-white'>
                            Сохранить изменения
                        </Button>
                        <Button className='bg-orange-500 hover:bg-orange-600 text-white'>
                            Сохранить заявку как новую
                        </Button>
                        <Button className='bg-orange-500 hover:bg-orange-600 text-white'>Редактировать</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderInfoModal
