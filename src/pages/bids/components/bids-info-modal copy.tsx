import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchPrivateData, postData2 } from '@/api/api'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const [data, setData] = useState()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(selectedBid || {})
    const [vehicleProfiles, setVehicleProfiles] = useState([])
    const [originalData, setOriginalData] = useState({ ...selectedBid })
    const [organizations, setOrganizations] = useState([])

    

    if (!selectedBid) return null

    const clientId = selectedBid?.clientId

    useEffect(() => {
        if (isModalOpen && clientId) {
            fetchVehicleProfiles()
        }
        setOriginalData({ ...selectedBid })
        setFormData(selectedBid) // Синхронизация formData при открытии модалки
    }, [isModalOpen, clientId])

    useEffect(() => {
        if (vehicleProfiles.length > 0 && formData.vehicleProfileId) {
            const matchedProfile = vehicleProfiles.find(v => v.id === formData.vehicleProfileId)
            if (matchedProfile) {
                setFormData(prev => ({ ...prev, vehicleProfile: matchedProfile }))
            }
        }
    }, [vehicleProfiles, formData.vehicleProfileId])

    const fetchVehicleProfiles = async () => {
        if (!clientId) return
        try {
            const token = localStorage.getItem('authToken')
            const data = await fetchPrivateData(`api/v1/organization/?organization_id=${clientId}`, token)
            setData(data)
            setVehicleProfiles(data.vehicleProfiles || [])
        } catch (error) {
            console.error('Ошибка загрузки типов перевозки:', error)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
        setFormData(selectedBid)
    }

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')

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

        try {
            await postData2(`api/v1/bids/${formData._id}`, updatedFields, token)
            alert('Заявка успешно обновлена!')
            setOriginalData({ ...formData })
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
        }
    }

    const handleSaveAsNew = () => {
        console.log('Сохраняем как новую заявку:', formData)
        setIsEditing(false)
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleVehicleChange = value => {
        const selectedVehicle = vehicleProfiles.find(v => v.id.toString() === value)

        setFormData(prev => ({
            ...prev,
            vehicleProfile: selectedVehicle || null,
            vehicleProfileId: selectedVehicle?.id || null
        }))
    }

    const fetchOrganizations = async () => {
        try {
            const token = localStorage.getItem('authToken')
            const data = await fetchPrivateData('api/v1/organization/', token)
            setOrganizations(data || [])
        } catch (error) {
            console.error('Ошибка загрузки организаций:', error)
        }
    }

    useEffect(() => {
        if (isModalOpen && selectedBid) {
            setFormData({
                ...selectedBid,
                cargoType: selectedBid.cargoType || '', // добавляем начальное значение
                loadingMode: selectedBid.loadingMode || ''
            })
        }
    }, [isModalOpen, selectedBid])

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-5'>
                <DialogTitle>Информация о заявке</DialogTitle>
                <ScrollArea className='space-y-4'>
                    {/* Радиокнопки для типа транспорта */}
                    <RadioGroup
                        className='flex gap-6 mt-2'
                        value={formData.cargoType}
                        onValueChange={value => setFormData(prev => ({ ...prev, transportType: value }))}
                        disabled={!isEditing} // Блокируем, если не в режиме редактирования
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
                        value={formData.loadingMode}
                        onValueChange={value => setFormData(prev => ({ ...prev, transportMethod: value }))}
                        disabled={!isEditing} // Блокируем, если не в режиме редактирования
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

                    <div>
                        <strong>Клиент:</strong>
                        <Select
                            onValueChange={value => handleChange('clientId', value)}
                            value={formData.clientId?.toString() || ''}
                            disabled={!isEditing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Выберите клиента' />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map(org => (
                                    <SelectItem key={org.organizationId} value={org.organizationId.toString()}>
                                        {org.organizationName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Селект для заказчика */}
                    <div>
                        <strong>Заказчик:</strong>
                        <Select
                            onValueChange={value => handleChange('customerId', value)}
                            value={formData.customerId?.toString() || ''}
                            disabled={!isEditing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Выберите заказчика' />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map(org => (
                                    <SelectItem key={org.organizationId} value={org.organizationId.toString()}>
                                        {org.organizationName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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

                <div className='flex justify-center gap-4 py-6'>
                    <Button
                        onClick={handleSave}
                        className='bg-orange-500 hover:bg-orange-600 text-white'
                        disabled={!isEditing}
                    >
                        Сохранить изменения
                    </Button>

                    <Button
                        onClick={handleSaveAsNew}
                        className='bg-orange-500 hover:bg-orange-600 text-white'
                        disabled={!isEditing}
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


