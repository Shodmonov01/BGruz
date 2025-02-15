// import { Button } from '@/components/ui/button'
// import { Modal } from '@/components/ui/modal'
// import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

// function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
//   console.log(selectedBid);

//   return (
//     <div>
//       <Modal className="!bg-background !px-1 w-[370px] md:w-[800px]" isOpen={isModalOpen} onClose={handleCloseModal}>
//         <div className="p-6">
//           <Card className="p-4 shadow-lg border border-gray-300 rounded-lg space-y-4">
//             <CardTitle className="text-xl font-bold">{selectedBid.cargoTitle || '—'}</CardTitle>
//             <CardDescription>
//               <div className="space-y-2">
//                 {/* Client Information */}
//                 <p><strong>Клиент:</strong> {selectedBid.client?.organizationName || '—'}</p>
//                 <p><strong>Дата создания:</strong> {selectedBid.createdAt || '—'}</p>
//                 <p><strong>Создал:</strong> {selectedBid.createdBy || '—'}</p>
//                 <p><strong>Создано в Bgruz:</strong> {selectedBid.createdInBgruzAt || '—'}</p>

//                 {/* Cargo Information */}
//                 <p><strong>Груз:</strong> {selectedBid.cargoTitle || '—'}</p>
//                 <p><strong>Тип груза:</strong> {selectedBid.cargoType || '—'}</p>
//                 <p><strong>Описание:</strong> {selectedBid.description || '—'}</p>

//                 {/* Pricing Information */}
//                 <p><strong>Цена:</strong> {selectedBid.price ? selectedBid.price : '—'}</p>
//                 <p><strong>Цена с НДС:</strong> {selectedBid.priceNds || '—'}</p>
//                 <p><strong>Полная цена:</strong> {selectedBid.fullPrice || '—'}</p>
//                 <p><strong>Полная цена с НДС:</strong> {selectedBid.fullPriceNds || '—'}</p>
//                 <p><strong>Запрос цены:</strong> {selectedBid.isPriceRequest ? 'Да' : 'Нет'}</p>

//                 {/* Date and Time Information */}
//                 <p><strong>Дата начала:</strong> {selectedBid.startDate || '—'}</p>
//                 <p><strong>Дата завершения:</strong> {selectedBid.dueDate || '—'}</p>
//                 <p><strong>Время подачи:</strong> {selectedBid.filingTime || '—'}</p>

//                 {/* Extra Services */}
//                 <div>
//                   <strong>Дополнительные услуги:</strong>
//                   {selectedBid.extraServices?.length > 0 ? (
//                     <ul className="list-disc pl-5">
//                       {selectedBid.extraServices.map((service, index) => (
//                         <li key={index}>{service.name || '—'}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     '—'
//                   )}
//                 </div>

//                 {/* Vehicle and Terminal Information */}
//                 <p><strong>Терминал 1:</strong> {selectedBid.terminal1?.address || '—'}</p>
//                 <p><strong>Терминал 2:</strong> {selectedBid.terminal2?.address || '—'}</p>
//                 <p><strong>Количество транспортных средств:</strong> {selectedBid.vehicleCount || '—'}</p>
//                 <p><strong>Тип транспортного средства:</strong> {selectedBid.vehicleProfile?.name || '—'}</p>

//                 {/* Status Information */}
//                 <p><strong>Статус:</strong> {selectedBid.status || '—'}</p>

//                 {/* Location Information */}
//                 <p><strong>Город отправления:</strong> {selectedBid.terminal1?.cityName || '—'}</p>
//                 <p><strong>Город назначения:</strong> {selectedBid.terminal2?.cityName || '—'}</p>
//                 <p><strong>Адрес склада:</strong> {selectedBid.warehouses?.[0]?.address || '—'}</p>
//               </div>
//             </CardDescription>
//             <CardFooter>
//               <Button onClick={handleCloseModal}>Закрыть</Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default BidsInfoModal

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { postData2 } from '@/api/api'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
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

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
                <div className='relative bg-white rounded-lg'>
                    <div className='p-6 text-center'>
                        <button
                            onClick={handleCloseModal}
                            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                        >
                            {/* <X className='h-4 w-4' /> */}
                            <span className='sr-only'>Close</span>
                        </button>
                        <h2 className='text-2xl font-semibold text-orange-500'>Заявка СМ ID {formData.persistentId}</h2>
                        <p className='text-sm mt-2'>
                            Дата {format(new Date(formData.loadingDate), 'dd.MM.yyyy')} №{formData.number}
                        </p>
                    </div>

                    <div className='px-6 space-y-6'>
                        <div>
                            <Label className='text-base'>Тип перевозки</Label>
                            <RadioGroup defaultValue={formData.loadingMode} className='flex gap-6 mt-2'>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='loading' id='loading' />
                                    <Label htmlFor='loading'>Погрузка</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='unloading' id='unloading' />
                                    <Label htmlFor='unloading'>Выгрузка</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='container' id='container' />
                                    <Label htmlFor='container'>Контейнер</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='wagon' id='wagon' />
                                    <Label htmlFor='wagon'>Вагон</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Label>Заказчик</Label>
                                <Input value={formData.customer?.organizationName || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Label>Получатель</Label>
                                <Input value={formData.client?.organizationName || ''} className='mt-1' readOnly />
                            </div>
                        </div>

                        <div>
                            <Label>Контактное лицо:</Label>
                            <div className='mt-1'>
                                <span>Иванов Иван | +7 998 851 6060</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-4'>
                            <div className='flex-1'>
                                <Label>Тип перевозки</Label>
                                <Input value={formData.vehicleProfile?.name || ''} className='mt-1' readOnly />
                            </div>
                            <div className='w-20'>
                                <Label>Кол-во</Label>
                                <Input type='number' value={formData.vehicleCount || 1} className='mt-1' readOnly />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Label>Дата погрузки</Label>
                                <Input
                                    value={format(new Date(formData.loadingDate), 'dd.MM.yyyy')}
                                    className='mt-1'
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label>Время подачи</Label>
                                <Input value={formData.filingTime || ''} className='mt-1' readOnly />
                            </div>
                        </div>

                        <div className='bg-cyan-500 text-white p-2 text-lg font-medium flex justify-center'>
                            Маршрут
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <Label>Терминал 1</Label>
                                    <Input value={formData.terminal1?.cityName || ''} className='mt-1' readOnly />
                                </div>
                                <div>
                                    <Label>Адрес</Label>
                                    <Input value={formData.terminal1?.address || ''} className='mt-1' readOnly />
                                </div>
                            </div>

                            <div>
                                <div className='space-y-4 mt-3'>
                                    <Label>Склад клиента</Label>
                                    <div className='grid grid-cols-2 gap-4 mt-1'>
                                        <Input value={formData.warehouses?.[0]?.cityName || ''} readOnly />
                                        <Input value={formData.warehouses?.[0]?.address || ''} readOnly />
                                    </div>
                                    <Button size='sm' variant='outline'>
                                        <Plus className='h-4 w-4 mr-1' />
                                        Добавить склад
                                    </Button>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <Label>Терминал 2</Label>
                                    <Input value={formData.terminal2?.cityName || ''} className='mt-1' readOnly />
                                </div>
                                <div>
                                    <Label>Адрес</Label>
                                    <Input value={formData.terminal2?.address || ''} className='mt-1' readOnly />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='bg-cyan-500 text-white p-2 text-lg font-medium mb-4 flex flex-col items-center'>
                                Финансы
                                <div className='text-sm font-normal'>Все цены указаны без НДС</div>
                            </div>

                            <div className='space-y-4'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='priceRequest' checked={formData.isPriceRequest} disabled />
                                    <Label htmlFor='priceRequest'>Запрос цены</Label>
                                </div>

                                <div>
                                    <Label>Цена перевозки</Label>
                                    <Input type='number' value={formData.price || ''} className='mt-1' readOnly />
                                </div>

                                <div className='space-y-2'>
                                    <Label>Доп услуги</Label>
                                    {formData.extraServices?.map(service => (
                                        <div key={service.id} className='flex items-center gap-4'>
                                            <Checkbox checked={true} disabled />
                                            <Label>{service.name}</Label>
                                            <Input type='number' value={service.count} className='w-20' readOnly />
                                            <Input type='number' value={service.price * service.count} readOnly />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <Label>Полная стоимость рейса без НДС</Label>
                                    <Input type='number' value={formData.fullPrice || ''} className='mt-1' readOnly />
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div>
                                <Label>Груз</Label>
                                <Input value={formData.cargoTitle || ''} className='mt-1' readOnly />
                            </div>
                            <div>
                                <Label>Комментарии</Label>
                                <Textarea value={formData.description || ''} className='mt-1 min-h-[100px]' readOnly />
                            </div>
                        </div>

                        <div className='flex justify-center gap-4 py-6'>
                            <Button
                                onClick={handleSave}
                                className='bg-orange-500 hover:bg-orange-600 text-white rounded-full'
                            >
                                Сохранить изменения
                            </Button>
                            <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-full'>
                                Сохранить заявку как новую
                            </Button>
                            <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-full'>
                                Редактировать
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BidsInfoModal
