import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchPrivateData, postData2 } from '@/api/api'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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

    //@ts-ignore
    useEffect(() => {
        if (isModalOpen && clientId) {
            fetchVehicleProfiles()
        }
        setOriginalData({ ...selectedBid })
    }, [isModalOpen, clientId])

    // Обновленный useEffect
    useEffect(() => {
        if (isModalOpen && selectedBid) {
            setFormData(prev => ({
                ...prev, // Оставляем уже измененные данные
                vehicleProfileId: prev.vehicleProfileId || selectedBid.vehicleProfileId?.toString() || '',
                transportType: prev.transportType || selectedBid.cargoType || '',
                transportMethod: prev.transportMethod || selectedBid.loadingMode || ''
            }))
        }
    }, [isModalOpen, selectedBid])

    

    const handleEdit = () => {
        setIsEditing(true)
        setFormData(selectedBid)
    }

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

    const handleVehicleChange = value => {
        //@ts-ignore
        const selectedVehicle = vehicleProfiles.find(v => v.id === parseInt(value))

        console.log(selectedVehicle)

        setFormData(prev => ({
            ...prev,
            vehicleProfile: selectedVehicle || null, // Обновляем сам объект
            //@ts-ignore
            vehicleProfileId: selectedVehicle?.id || null // Обновляем ID
        }))
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-5'>
                <DialogTitle>Информация о заявке</DialogTitle>
                <ScrollArea className='space-y-4'>
                    {/* Тип груза */}

                    <div className='flex items-center border-b-2 border-[#D0D1D5] pb-4'>
                        <Label className='text-base font-medium mr-4'>Тип перевозки</Label>
                        {/* Радиокнопки для типа транспорта */}
                        <RadioGroup
                            className='flex gap-6 mt-2'
                            value={formData.transportType} // Устанавливаем текущее значение
                            onValueChange={value => setFormData(prev => ({ ...prev, transportType: value }))}
                            disabled={!isEditing}
                        >
                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='container' id='container' />
                                <Label htmlFor='container'>Контейнер</Label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='wagon' id='wagon' />
                                <Label htmlFor='wagon'>Вагон</Label>
                            </div>
                        </RadioGroup>

                        {/* Радиокнопки для способа загрузки */}
                        <RadioGroup
                            className='flex gap-6 mt-2'
                            value={formData.transportMethod}
                            onValueChange={value => setFormData(prev => ({ ...prev, transportMethod: value }))}
                            disabled={!isEditing}
                        >
                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='loading' id='loading' />
                                <Label htmlFor='loading'>Погрузка</Label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <RadioGroupItem value='unloading' id='unloading' />
                                <Label htmlFor='unloading'>Выгрузка</Label>
                            </div>
                        </RadioGroup>
                    </div>

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
                                        //@ts-expect-error fdkfj hido
                                        <SelectItem key={option.id} value={option.id.toString()}>{option.name}
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
