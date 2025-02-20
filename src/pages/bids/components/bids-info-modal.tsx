import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { postData2, fetchPrivateData } from '@/api/api'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Terminal, UserContext, VehicleProfile, Warehouse } from '@/types'

function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const [formData, setFormData] = useState({ ...selectedBid })
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
    const [clients, setClients] = useState<UserContext[]>([])
    const [terminals, setTerminals] = useState<Terminal[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<VehicleProfile[]>([])
    {
        /* @ts-expect-error что нибудь придумаем */
    }
    const [extraServices, setExtraServices] = useState([])
    const [data, setData] = useState()
    const [isFetched, setIsFetched] = useState(true)
    const [originalData, setOriginalData] = useState({ ...selectedBid }) // Сохраняем оригинальные данные

    console.log(selectedBid)

    useEffect(() => {
        setFormData({ ...selectedBid })
        setOriginalData({ ...selectedBid }) // Обновляем оригинальные данные при открытии модалки
    }, [selectedBid])

    useEffect(() => {
        const loadClients = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const data = await fetchPrivateData('api/v1/organization/clients', token)
                setClients(data)
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error)
            }
        }
        loadClients()
    }, [])

    const handleChange = (name, value) => {
        setFormData(prev => {
            if (name.includes('extraServices')) {
                const [_, index, field] = name.match(/extraServices\[(\d+)\]\.(.+)/)
                const newExtraServices = [...prev.extraServices]
                newExtraServices[index] = {
                    ...newExtraServices[index],
                    [field]: value
                }
                return {
                    ...prev,
                    extraServices: newExtraServices
                }
            }
            return { ...prev, [name]: value }
        })
    }

    const handleClientChange = async (clientId: string) => {
        handleChange('client', clientId)
        try {
            const token = localStorage.getItem('authToken')
            const data = await fetchPrivateData(`api/v1/organization/?organization_id=${clientId}`, token)
            setData(data)

            setTerminals(data.terminals || [])
            setWarehouses(data.warehouses || [])
            setVehicleProfiles(data.vehicleProfiles || [])
            setExtraServices(data.extraServices || [])
        } catch (error) {
            console.error('Ошибка при загрузке данных организации:', error)
        }
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
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
        }
    }
    const handleEdit = () => {
        handleClientChange(formData.client?.organizationId)
        setIsFetched(false)
        console.log(data)
    }

    useEffect(() => {
        if (data) {
            setIsReadOnly(false)
        }
    }, [data])

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTitle></DialogTitle>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
                <div className='relative bg-white rounded-lg'>
                    <div className='p-6 space-y-6'>
                        <div className='text-center'>
                            <h2 className='text-[32px] font-bold text-tertiary'>
                                Заявка СМ ID {formData.persistentId}
                            </h2>
                            <div className='text-lg text-center flex gap-3 items-center justify-center'>
                                <span>Дата {format(new Date(formData.loadingDate || new Date()), 'dd.MM.yyyy')}</span> №
                                <span>{formData.number}</span>
                            </div>
                        </div>

                        <div className='flex items-center border-b-2 border-[#D0D1D5] gap-8 pb-4'>
                            <Label className='text-base text-[20px] mr-4 font-bold text-[#1E293B]'>Тип перевозки</Label>
                            <div className='flex items-center justify-between gap-10 '>
                                <RadioGroup
                                    defaultValue={formData.loadingMode}
                                    className='flex gap-4'
                                    onValueChange={value => handleChange('loadingMode', value)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Label htmlFor='loading' className=''>
                                            Погрузка
                                        </Label>
                                        <RadioGroupItem
                                            className='size-5'
                                            value='loading'
                                            id='loading'
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <RadioGroupItem
                                            className='size-5'
                                            value='unloading'
                                            id='unloading'
                                            disabled={isReadOnly}
                                        />
                                        <Label htmlFor='unloading'>Выгрузка</Label>
                                    </div>
                                </RadioGroup>
                                <RadioGroup
                                    defaultValue={formData.cargoType}
                                    className='flex gap-4'
                                    onValueChange={value => handleChange('loadingMode', value)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Label htmlFor='container'>Контейнер</Label>
                                        <RadioGroupItem
                                            className='size-5'
                                            value='container'
                                            id='container'
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <RadioGroupItem
                                            className='size-5'
                                            value='wagon'
                                            id='wagon'
                                            disabled={isReadOnly}
                                        />
                                        <Label htmlFor='wagon'>Вагон</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div className='flex gap-4 items-center'>
                                <Label className=' min-w-36  text-[18px] font-bold text-[#1E293B]'>Тип перевозки</Label>
                                <div className='flex gap-4 items-center w-full'>
                                    <Select
                                        onValueChange={value => handleChange('vehicleProfileId', value)}
                                        value={formData.vehicleProfileId ? formData.vehicleProfileId.toString() : ''}
                                    >
                                        <SelectTrigger className='mt-1'>
                                            <SelectValue>
                                                {formData.vehicleProfile?.name || 'Выберите профиль транспорта'}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicleProfiles.map(profile => (
                                                <SelectItem key={profile.id} value={profile.id.toString()}>
                                                    {profile.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className=''>
                                    <div className='flex items-start mt-1'>
                                        <Input
                                            type='number'
                                            value={formData.vehicleCount || 1}
                                            min={1}
                                            onChange={e =>
                                                handleChange('vehicleCount', Number.parseInt(e.target.value))
                                            }
                                            className='text-center'
                                            readOnly={isReadOnly}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center gap-5'>
                                    <Label className='text-[18px] font-bold text-[#1E293B] '>Дата погрузки</Label>
                                    <div className='flex gap-2 mt-1 relative left-4'>
                                        <Input
                                            type='date'
                                            value={format(new Date(formData.loadingDate || new Date()), 'yyyy-MM-dd')}
                                            onChange={e => handleChange('loadingDate', e.target.value)}
                                            readOnly={isReadOnly}
                                        />
                                        <div className='flex items-center justify-center px-2  text-[#00b6f1] font-medium'>
                                            ПО
                                        </div>
                                        <Input
                                            type='date'
                                            value={formData.dueDate}
                                            className='flex-1'
                                            readOnly={isReadOnly}
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <Label className='text-[18px] font-bold text-[#1E293B] min-w-36'>
                                        Время подачи
                                    </Label>
                                    <Input
                                        type='time'
                                        className='mt-1 w-[115px]'
                                        value={formData.filingTime || ''}
                                        onChange={e => handleChange('filingTime', e.target.value)}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center text-xl text-[20px] font-bold'>
                            Маршрут
                        </div>

                        <div className='space-y-4'>
                            <div>
                                <Label className='text-[18px] font-bold text-[#1E293B]'>Терминал 1</Label>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <Select
                                            onValueChange={value => handleChange('terminal1', value)}
                                            value={formData.terminal1?.id ? formData.terminal1.id.toString() : ''}
                                        >
                                            <SelectTrigger className='mt-1'>
                                                <SelectValue>
                                                    {formData.terminal1?.name || 'Выберите терминал 1'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {terminals.map(terminal => (
                                                    <SelectItem key={terminal.id} value={terminal.id.toString()}>
                                                        {terminal.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        {/* <Label className='text-[18px] font-bold text-[#1E293B]'>Адрес</Label> */}
                                        <Input
                                            className='mt-1'
                                            value={formData.terminal1?.address || ''}
                                            readOnly={isReadOnly}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className='text-[18px] font-bold text-[#1E293B]'>Склад клиента</Label>
                                <div className='grid grid-cols-2 gap-4 mt-1'>
                                    <Select
                                        onValueChange={value => handleChange('warehouse', value)}
                                        defaultValue={formData.warehouses?.[0]?.cityId?.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Выберите склад' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map(warehouse => (
                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                    {warehouse.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        value={formData.warehouses?.[0]?.address || ''}
                                        placeholder='Адрес'
                                        readOnly={isReadOnly}
                                    />
                                </div>
                                <Button size='sm' className='mt-2 bg-[#00b6f1] font-semibold'>
                                    <Plus className='h-4 w-4 mr-1' />
                                    Добавить склад
                                </Button>
                            </div>

                            <div>
                                <Label className='text-[18px] font-bold text-[#1E293B]'>Терминал 2</Label>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <Select
                                            onValueChange={value => handleChange('terminal2', value)}
                                            defaultValue={formData.terminal2?.cityId?.toString()}
                                        >
                                            <SelectTrigger className='mt-1'>
                                                <SelectValue placeholder='Выберите терминал 2' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {terminals.map(terminal => (
                                                    <SelectItem key={terminal.id} value={terminal.id.toString()}>
                                                        {terminal.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Input
                                            className='mt-1'
                                            value={formData.terminal2?.address || ''}
                                            readOnly={isReadOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center'>
                            <div className='text-[20px] font-bold '>Финансы</div>
                            <div className='text-sm'>Все цены указаны без НДС</div>
                        </div>

                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox
                                        id='priceRequest'
                                        checked={formData.isPriceRequest}
                                        onCheckedChange={checked => handleChange('isPriceRequest', checked)}
                                    />
                                    <Label htmlFor='priceRequest' className='text-[18px] font-bold text-[#1E293B]'>
                                        Запрос цены
                                    </Label>
                                </div>

                                <div className='flex items-center'>
                                    <Label className='text-[18px] font-bold text-[#1E293B] min-w-28'>
                                        Цена перевозки
                                    </Label>
                                    <Input
                                        type='number'
                                        className='w-full'
                                        name='price'
                                        value={formData.price || ''}
                                        onChange={e => handleChange('price', e.target.value)}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <div className='mb-6'>
                                    <Label className='text-[18px] font-bold text-[#1E293B]'>Доп услуги</Label>
                                </div>
                                <div className='space-y-2'>
                                    {formData.extraServices?.map((service, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Checkbox id={`service${index}`} checked={true} />
                                            <Label
                                                className='text-[18px] font-bold text-[#1E293B]'
                                                htmlFor={`service${index}`}
                                            >
                                                {service.name}
                                            </Label>
                                            <div className='flex items-center gap-2 ml-auto'>
                                                <Input
                                                    type='number'
                                                    className='w-20'
                                                    value={service.count}
                                                    onChange={e =>
                                                        handleChange(
                                                            `extraServices[${index}].count`,
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    readOnly={isReadOnly}
                                                />
                                                <Input
                                                    type='number'
                                                    value={service.price}
                                                    onChange={e =>
                                                        handleChange(`extraServices[${index}].price`, e.target.value)
                                                    }
                                                    className='w-[185px]'
                                                    readOnly={isReadOnly}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='flex items-center'>
                                <Label className='text-[18px] font-bold text-[#1E293B] w-full min-w-[420px]'>
                                    Полная стоимость рейса без НДС
                                </Label>
                                <Input
                                    type='text'
                                    className='mt-1'
                                    value={formData.fullPrice || ''}
                                    onChange={e => handleChange('fullPrice', e.target.value)}
                                    readOnly={isReadOnly}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div>
                                <Label className='text-[18px] font-bold text-[#1E293B]'>Груз</Label>
                                <Input
                                    className='mt-1'
                                    placeholder='Название груза'
                                    value={formData.cargoTitle || ''}
                                    onChange={e => handleChange('cargoTitle', e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label className='text-[18px] font-bold text-[#1E293B]'>Комментарии</Label>
                                <Textarea
                                    placeholder='Комментарии к грузу'
                                    className='mt-1 min-h-[100px]'
                                    value={formData.description || ''}
                                    onChange={e => handleChange('description', e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                        </div>

                        <div className='flex justify-center gap-4 py-6'>
                            <Button
                                disabled={isReadOnly}
                                onClick={handleSave}
                                className='bg-orange-500 hover:bg-orange-600 text-white'
                            >
                                Сохранить изменения
                            </Button>
                            <Button disabled={isReadOnly} className='bg-orange-500 hover:bg-orange-600 text-white'>
                                Сохранить заявку как новую
                            </Button>
                            <Button onClick={handleEdit} className='bg-orange-500 hover:bg-orange-600 text-white'>
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
