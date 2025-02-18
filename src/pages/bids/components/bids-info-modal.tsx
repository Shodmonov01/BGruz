import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchPrivateData, postData2 } from '@/api/api'

const vehicleOptions = [
    { id: 169, name: 'Тент 20т 82 куб' },
    { id: 170, name: 'Рефрижератор 10т 50 куб' },
    { id: 171, name: 'Контейнеровоз 30т 70 куб' }
]

function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(selectedBid || {})
    const [vehicleProfiles, setVehicleProfiles] = useState([])
    const [originalData, setOriginalData] = useState({ ...selectedBid })

    if (!selectedBid) return null

    const clientId = selectedBid?.clientId


    const fetchVehicleProfiles = async () => {
        if (!clientId) return 

        try {
            const token = localStorage.getItem('authToken')
            const data = await fetchPrivateData(`api/v1/organization/?organization_id=${clientId}`, token)
            setVehicleProfiles(data.vehicleProfiles || [])
            
        } catch (error) {
            console.error('Ошибка загрузки типов перевозки:', error)
        }
    }

    useEffect(() => {
        if (isModalOpen && clientId) {
            fetchVehicleProfiles()
        }
        setOriginalData({ ...selectedBid })
    }, [isModalOpen, clientId])
    

    const handleEdit = () => {
        setIsEditing(true)
        setFormData(selectedBid)
    }

    // const handleSave = () => {
    //     console.log('Сохраняем изменения:', formData)
    //     setIsEditing(false)
    //     // Здесь отправляем данные на сервер
    // }

    // const handleSave = async () => {
    //     const token = localStorage.getItem('authToken')

    //     const updatedFields = Object.keys(formData).reduce((acc, key) => {
    //         if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
    //             acc[key] = formData[key]
    //         }
    //         return acc
    //     }, {})

    //     if (Object.keys(updatedFields).length === 0) {
    //         alert('Нет изменений для сохранения.')
    //         return
    //     }

    //     try {
    //         await postData2(`api/v1/bids/${formData._id}`, updatedFields, token)
    //         alert('Заявка успешно обновлена!')
    //         handleCloseModal()
    //     } catch (error) {
    //         console.error('Ошибка при обновлении заявки:', error)
    //     }
    // }

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')
    
        // Определяем только измененные поля
        const updatedFields = Object.keys(formData).reduce((acc, key) => {
            if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
                acc[key] = formData[key]
            }
            return acc
        }, {})
    
        if (Object.keys(updatedFields).length === 0) {
            alert('Нет изменений для сохранения.')
            return
        }

        console.log('Отправляем на сервер:', updatedFields)
    
        try {
            await postData2(`api/v1/bids/${formData._id}`, updatedFields, token)
            alert('Заявка успешно обновлена!')
            
            // Обновляем оригинальные данные, чтобы отслеживать новые изменения
            setOriginalData({ ...formData })
    
            // Закрываем модальное окно
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
        }
    }
    

    const handleSaveAsNew = () => {
        console.log('Сохраняем как новую заявку:', formData)
        setIsEditing(false)
        // Здесь отправляем данные на сервер как новую запись
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleVehicleChange = (value) => {
        const selectedVehicle = vehicleProfiles.find(v => v.id === parseInt(value))

        console.log(selectedVehicle);
        
    
        setFormData(prev => ({
            ...prev,
            vehicleProfile: selectedVehicle || null, // Обновляем сам объект
            vehicleProfileId: selectedVehicle?.id || null // Обновляем ID
        }))
    }
    

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-5'>
                <DialogTitle>Информация о заявке</DialogTitle>
                <ScrollArea className='space-y-4'>
                    {/* Название груза */}
                    <div>
                        <strong>Название груза:</strong>
                        {isEditing ? (
                            <Input name='cargoTitle' value={formData.cargoTitle} onChange={handleChange} />
                        ) : (
                            <p>{formData.cargoTitle}</p>
                        )}
                    </div>

                    {/* Тип груза */}
                    <div>
                        <strong>Тип груза:</strong>
                        {isEditing ? (
                            <Input name='cargoType' value={formData.cargoType} onChange={handleChange} />
                        ) : (
                            <p>{formData.cargoType}</p>
                        )}
                    </div>

                    {/* Описание */}
                    <div>
                        <strong>Описание:</strong>
                        {isEditing ? (
                            <Textarea name='description' value={formData.description} onChange={handleChange} />
                        ) : (
                            <p>{formData.description || 'Нет описания'}</p>
                        )}
                    </div>

                    <hr />

                    {/* Цена */}
                    <div>
                        <strong>Цена:</strong>
                        {isEditing ? (
                            <Input name='price' type='number' value={formData.price} onChange={handleChange} />
                        ) : (
                            <p>{formData.price ? `${formData.price} ₽` : 'Не указана'}</p>
                        )}
                    </div>

                    <div>
                        <strong>Финальная цена с НДС:</strong>
                        {isEditing ? (
                            <Input
                                name='fullPriceNds'
                                type='number'
                                value={formData.fullPriceNds}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{formData.fullPriceNds ? `${formData.fullPriceNds} ₽` : 'Не указана'}</p>
                        )}
                    </div>

                    <hr />

                    {/* Клиент и заказчик */}
                    <div>
                        <strong>Клиент:</strong>
                        <p>{formData.client?.organizationName || 'Не указан'}</p>
                    </div>

                    <div>
                        <strong>Заказчик:</strong>
                        <p>{formData.customer?.organizationName || 'Не указан'}</p>
                    </div>

                    <hr />

                    {/* Маршрут */}
                    <div>
                        <strong>Маршрут:</strong>
                        <p>
                            {formData.terminal1?.cityName} → {formData.terminal2?.cityName}
                        </p>
                    </div>

                    <div>
                        <strong>Адрес погрузки:</strong>
                        <p>{formData.terminal1?.address}</p>
                    </div>

                    <div>
                        <strong>Адрес разгрузки:</strong>
                        <p>{formData.terminal2?.address}</p>
                    </div>

                    <hr />

                    {/* Тип перевозки */}
                    <div>
                        <strong>Тип перевозки:</strong>
                        <p>{formData.vehicleProfile?.name || 'Не указан'}</p>
                    </div>

                    <div>
                        <strong>Количество машин:</strong>
                        {isEditing ? (
                            <Input
                                name='vehicleCount'
                                type='number'
                                value={formData.vehicleCount}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{formData.vehicleCount || 1}</p>
                        )}
                    </div>

                    <hr />

                    {/* Дата создания */}
                    <div>
                        <strong>Создано:</strong>
                        <p>{new Date(formData.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                        <strong>Создано пользователем:</strong>
                        <p>{formData.createdBy}</p>
                    </div>

                    <div>
                        <strong>Название груза:</strong>
                        {isEditing ? (
                            <Input name='cargoTitle' value={formData.cargoTitle} onChange={handleChange} />
                        ) : (
                            <p>{formData.cargoTitle}</p>
                        )}
                    </div>

                    <div>
                        <strong>Тип перевозки:</strong>
                        {isEditing ? (
                            <Select
                                onValueChange={handleVehicleChange}
                                value={formData.vehicleProfileId?.toString() || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Выберите тип перевозки' />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleProfiles.map(option => (
                                        <SelectItem key={option.id} value={option.id.toString()}>
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <p>{formData.vehicleProfile?.name || 'Не указан'}</p>
                        )}
                    </div>
                </ScrollArea>

                {/* Кнопки */}
                <div className='flex justify-center gap-4 py-6'>
                    <Button
                        onClick={handleSave}
                        className='bg-orange-500 hover:bg-orange-600 text-white'
                        disabled={!isEditing} // Кнопка отключена, если не в режиме редактирования
                    >
                        Сохранить изменения
                    </Button>

                    <Button
                        onClick={handleSaveAsNew}
                        className='bg-orange-500 hover:bg-orange-600 text-white'
                        disabled={!isEditing} // Кнопка отключена, если не в режиме редактирования
                    >
                        Сохранить заявку как новую
                    </Button>

                    <Button onClick={handleEdit} className='bg-orange-500 hover:bg-orange-600 text-white'>
                        Редактировать
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BidsInfoModal
