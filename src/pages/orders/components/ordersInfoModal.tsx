import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { postData2 } from '@/api/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useNumberFormatter from '@/hooks/use-format-number'

function OrderInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const { formatNumber } = useNumberFormatter()
    const [formData, setFormData] = useState({
        ...selectedBid
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
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

    console.log('formData Orders', formData)

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTrigger asChild>
                <Button variant='outline'>Open Order</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto !p-0'>
                <DialogHeader>
                    <div className=''>
                        <div className='mb-6 mt-3 px-6'>
                            <span className='rounded bg-orange-500 px-4 py-2 text-sm text-white mt-3 '>
                                {formData.status === 'new'
                                    ? 'Новый'
                                    : formData.status === 'cancelledByCustomer'
                                      ? 'Отменено клиентом'
                                      : formData.status}
                            </span>
                        </div>
                        <div className='flex justify-center items-center w-full'>
                            <div className='flex items-center gap-4 w-full justify-center'>
                                <span className='text-[#03B4E0] w-[33%] flex justify-center text-[22px] font-semibold'>
                                    CM ID 47
                                </span>
                                <span className='text-[40px] w-[33%] text-[#EE6F2D] flex justify-center border-x-2 px-14 border-[#EE6F2D] font-bold'>
                                    Заказ
                                </span>
                                {/* <div className='flex items-center'> */}
                                <span className='text-[#03B4E0] text-[22px] flex font-semibold justify-center mx-auto w-[33%]'>
                                    ID {formData._id} от {new Date(formData.createdAt).toLocaleDateString('ru-RU')}
                                </span>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className='bg-cyan-500 flex py-2 px-6 text-white '>
                    <div>
                        <p className=' font-bold text-[20px]'>Статус заказа</p>
                    </div>
                </div>

                <div className='grid gap-6'>
                    <div className='flex justify-between px-10'>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold '>Статус заказа:</p>
                            <input
                                type='text'
                                name='status'
                                value={
                                    formData.status === 'new'
                                        ? 'Новый'
                                        : formData.status === 'cancelledByCustomer'
                                          ? 'Отменено клиентом'
                                          : formData.status
                                }
                                onChange={handleChange}
                                className='border border-gray-300 rounded px-2 py-1'
                            />
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold'>Изменено</p>
                            <p>{new Date(formData.statusUpdated).toLocaleString('ru-RU')}</p>
                        </div>
                    </div>

                    <div className='flex justify-between items-center px-10'>
                        <div className='flex justify-between items-center gap-4'>
                            <p className='font-bold'>Документы сданы:</p>
                            <p className='flex items-center gap-2'>
                                <Checkbox
                                    checked={!!formData.docSubmissionDate}
                                    onChange={e => {
                                        setFormData(prev => ({
                                            ...prev,
                                            docSubmissionDate: e.target.checked ? new Date().toISOString() : null
                                        }))
                                    }}
                                />
                                {formData.docSubmissionDate
                                    ? new Date(formData.docSubmissionDate).toLocaleString('ru-RU')
                                    : 'Не сданы'}
                            </p>
                        </div>
                        <div className='flex justify-between items-center gap-4 relative -left-14'>
                            <p className='font-bold'>Изменено</p>
                            <p>
                                {formData.docSubmissionUserId ? 'ID: ' + formData.docSubmissionUserId : 'Не изменено'}
                            </p>
                        </div>
                    </div>

                    <div className='bg-cyan-500 text-[20px] flex py-2 px-6 text-white justify-between'>
                        <div>
                            <p className=' font-bold'>
                                Дата погрузки {new Date(formData.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                        <div>
                            <p className=' font-bold'>
                                Срок доставки {new Date(formData.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                            </p>
                        </div>
                    </div>

                    <div className='flex  items-center gap-4 px-10'>
                        <p className='font-bold text-[20px]'>Тип перевозки</p>
                        <RadioGroup className='flex items-center gap-6 ml-12' defaultValue={formData.loadingMode}>
                            <p className='flex items-center gap-2'>
                                {formData.buyBid.cargoType}
                                <RadioGroupItem
                                    className='size-5'
                                    value='loadingMode'
                                    id='loadingMode'
                                    checked={true}
                                    disabled
                                />
                            </p>
                            <p className='flex items-center gap-2'>
                                {formData.buyBid.loadingMode}
                                <RadioGroupItem
                                    className='size-5'
                                    value='loadingMode'
                                    id='loadingMode'
                                    checked={true}
                                    disabled
                                />
                            </p>
                        </RadioGroup>
                    </div>

                    <div className='flex justify-between items-center px-10'>
                        <div className='flex justify-between items-center gap-4'>
                            <p className=' font-bold  text-[20px]'>Время подачи</p>
                            <p>{formData.loadingDate}</p>
                        </div>
                        <div className='flex justify-between items-center gap-4'>
                            <p className=' font-bold  text-[20px]'>Профиль ТС</p>
                            <p>{formData.buyBid.vehicleProfile.name}</p>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-6 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Маршрут</p>
                    </div>

                    <div className='px-10'>
                        <p className='text-[20px] font-bold'>Терминал 1</p>
                        <div className='grid grid-cols-2 gap-16'>
                            <div>
                                <Input value={formData.buyBid.terminal1.cityName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Input value={formData.buyBid.terminal1.address || ''} className='mt-1' readOnly />
                            </div>
                        </div>
                    </div>

                    <div className='px-10'>
                        <p className='text-[20px] font-bold '>Склад клиента</p>
                        <div className='grid grid-cols-2 gap-16'>
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

                    <div className='px-10'>
                        <p className='text-[20px] font-bold'>Терминал 2</p>
                        <div className='grid grid-cols-2 gap-16'>
                            <div>
                                <Input value={formData.buyBid.terminal2.cityName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Input value={formData.buyBid.terminal2.address || ''} className='mt-1' readOnly />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-6 text-white justify-between'>
                        <p className='text-[20px] font-bold'>Транспорт</p>
                        <p>{formData.buyBid.vehicleProfile.name}</p>
                    </div>

                    <div className='flex justify-between px-10'>
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Водитель</p>
                                <input
                                    type='text'
                                    value={formData.assignedVehicle?.driverName}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Машина</p>
                                <input
                                    type='text'
                                    value={formData.assignedVehicle?.plateNum}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Прицеп</p>
                                <input
                                    type='text'
                                    value={formData.assignedTrailer?.plateNum}
                                    className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <img src='/map.png' alt='' />
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Файлы</p>
                                <button
                                    value='Ссылка на файл'
                                    // className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                >
                                    <a
                                        href={`mailto:${formData.customer.email}`}
                                        className='border ml-3 border-gray-300 w-[185px] rounded px-2 py-1 text-sm flex justify-center text-primary underline'
                                    >
                                        Ссылка на файл
                                    </a>
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Файлы</p>
                                <button
                                    value='Ссылка на файл'
                                    // className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                >
                                    <a
                                        href={`mailto:${formData.customer.email}`}
                                        className='border ml-3 border-gray-300 w-[185px] rounded px-2 py-1 text-sm flex justify-center text-primary underline'
                                    >
                                        Ссылка на файл
                                    </a>
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold'>Файлы</p>
                                <button
                                    value='Ссылка на файл'
                                    // className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                >
                                    <a
                                        href={`mailto:${formData.customer.email}`}
                                        className='border ml-3 border-gray-300 w-[185px] rounded px-2 py-1 text-sm flex justify-center text-primary underline'
                                    >
                                        Ссылка на файл
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex flex-col py-2 px-6 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Финансы</p>
                        <p>Все цены указаны без НДС</p>
                    </div>

                    <div className='shadow-none border-0 px-10'>
                        <div className='grid gap-4 pt-6'>
                            <div className='grid gap-4'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div>
                                        <p className='text-[20px] font-bold mb-3'>Перевозка</p>
                                    </div>
                                    <div>
                                        <p className='text-[20px] font-bold mb-3'>Цена с НДС</p>
                                        <Input
                                            className=' text-right'
                                            value={formatNumber(String(formData.priceNds.toFixed(2)))}
                                            placeholder='Цена с НДС'
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <p className='text-[20px] font-bold mb-3'>Цена без НДС</p>
                                        <Input
                                            className=' text-right'
                                            value={formatNumber(String(formData.price.toFixed(2)))}
                                            placeholder='Цена без НДС'
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className='text-[20px] font-bold mb-3'>Доп услуги</p>
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
                                                        className='min-w-[240px] font-bold'
                                                        htmlFor={`service-${index}`}
                                                    >
                                                        {service.name}
                                                    </label>
                                                    <Input
                                                        type='number'
                                                        className='w-20 '
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
                                                    <Input
                                                        className=' text-right'
                                                        value={service.priceNds.toFixed(2)}
                                                        readOnly
                                                    />
                                                    <Input
                                                        className=' text-right'
                                                        value={service.price.toFixed(2)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <div className='w-full flex justify-end '>
                                            <button className='bg-tertiary text-white py-1 px-4 rounded-sm'>
                                                Сохранить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2 px-10'>
                        <div className='flex items-center gap-2'>
                            <p className=' font-bold w-full min-w-[350px] text-[20px]'>
                                Полная стоимость рейса без НДС
                            </p>
                            <Input
                                className=' text-right'
                                value={formData.fullPriceNds.toFixed(2)}
                                placeholder='Полная стоимость с НДС'
                                readOnly
                            />
                            <Input
                                className=' text-right'
                                value={formData.fullPrice.toFixed(2)}
                                placeholder='Полная стоимость без НДС'
                                readOnly
                            />
                        </div>
                    </div>
                    <div className='px-10'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <p className='font-bold text-[20px]'>Груз</p>
                                <Input
                                    className='mt-1'
                                    placeholder='Название груза'
                                    value={formData.terminal1?.cityName || ''}
                                    readOnly
                                />
                            </div>
                            <div>
                                <p className=' font-bold text-[20px]'>Стоимость груза</p>
                                <Input
                                    className='mt-1 text-right'
                                    name='price'
                                    value={formatNumber(String(formData.price))}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='w-full flex justify-end mt-3'>
                            <button className='bg-tertiary text-white py-1 px-4 rounded-sm'>Сохранить</button>
                        </div>
                    </div>

                    <div className='px-10'>
                        <div className='pt-6'>
                            <div className='grid gap-2 '>
                                <Label className='font-bold text-[20px]'>Комментарии</Label>
                                <Textarea className='h-[148px]' placeholder='Комментарии к грузу' />
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-6 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Контакты сторон</p>
                    </div>

                    <div className='flex gap-10 px-3  border-b-2 border-[#03B4E0] mx-7 pb-4'>
                        <div className='space-y-2 flex-1'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Заказчик</p>
                                <input
                                    type='text'
                                    value={formData.customer.organizationName}
                                    className='border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold  min-w-[120px]'>ИНН</p>
                                <input
                                    type='text'
                                    value={formData.customer.inn}
                                    className='border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold  min-w-[120px]'>Раб телефон</p>
                                <input
                                    type='text'
                                    value={formData.customer.organizationPhone}
                                    className='border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='space-y-2 flex-1'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Отвественный</p>
                                <input
                                    type='text'
                                    value={formData.customer.fio}
                                    className='border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Телефон</p>
                                <input
                                    type='text'
                                    value={formData.customer.phone}
                                    className='border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Почта</p>
                                <a
                                    href={`mailto:${formData.customer.email}`}
                                    className='border ml-3  w-full border-gray-300 rounded px-2 py-1 text-sm flex justify-center text-primary underline'
                                >
                                    {formData.carrier.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-10 px-3  border-b-2 border-[#03B4E0] mx-7 pb-4 '>
                        <div className='space-y-2 flex-1'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold  min-w-[120px]'>Заказчик</p>
                                <input
                                    type='text'
                                    value={formData.carrier.organizationName}
                                    className='border  w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>ИНН</p>
                                <input
                                    type='text'
                                    value={formData.carrier.inn}
                                    className='border  w-full  ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Раб телефон</p>
                                <input
                                    type='text'
                                    value={formData.carrier.organizationPhone}
                                    className='border  w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='space-y-2 flex-1'>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Отвественный</p>
                                <input
                                    type='text'
                                    value={formData.carrier.fio}
                                    className='border  w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Телефон</p>
                                <input
                                    type='text'
                                    value={formData.carrier.phone}
                                    className='border  w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm flex justify-center items-center'
                                    readOnly
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-bold min-w-[120px]'>Почта</p>
                                <a
                                    href={`mailto:${formData.carrier.email}`}
                                    className='border  w-full ml-3 border-gray-300  rounded px-2 py-1 text-sm flex justify-center text-primary underline'
                                >
                                    {formData.carrier.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-6 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Приклепленные файлы</p>
                    </div>

                    <div className='flex flex-col text-[#03B4E0] font-bold underline px-10'>
                        {formData.assignedVehicleFiles.map((file, index) => (
                            <a key={index} href={file.link}>
                                Ссылка
                            </a>
                        ))}
                    </div>

                    <div className='bg-cyan-500 flex py-2 px-6 text-white justify-center'>
                        <p className='text-[20px] font-bold'>Сформированные документы</p>
                    </div>

                    {formData.documentOrderItems.map((doc, index) => (
                        <div key={index} className='flex px-10'>
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
