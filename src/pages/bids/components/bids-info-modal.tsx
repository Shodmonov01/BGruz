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
     {/* @ts-expect-error что нибудь придумаем */}
    const [extraServices, setExtraServices] = useState([])
    const [data, setData] = useState()
    const [isFetched, setIsFetched] = useState(true)


    console.log(selectedBid);
    

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

        const updatedVal = {
            ...formData
        }
        console.log('updatedVal', updatedVal)

        try {
            await postData2(`api/v1/bids/${formData._id}`, updatedVal, token)
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
                            <h2 className='text-2xl font-bold text-tertiary'>Заявка СМ ID {formData.persistentId}</h2>
                            <p className='text-sm '>
                                Дата {format(new Date(formData.loadingDate || new Date()), 'dd.MM.yyyy')} №
                                {formData.number}
                            </p>
                        </div>

                        <div className='space-y-4'>
                            <div className='flex items-center border-b-2 border-[#D0D1D5] pb-4'>
                                <Label className='text-base font-medium mr-4'>Тип перевозки</Label>
                                <RadioGroup
                                    defaultValue={formData.loadingMode}
                                    className='flex gap-6 mt-2'
                                    onValueChange={value => handleChange('loadingMode', value)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <RadioGroupItem value='loading' id='loading' disabled={isReadOnly} />
                                        <Label htmlFor='loading'>Погрузка</Label>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <RadioGroupItem value='unloading' id='unloading' disabled={isReadOnly} />
                                        <Label htmlFor='unloading'>Выгрузка</Label>
                                    </div>
                                  
                                </RadioGroup>
                                <RadioGroup
                                    defaultValue={formData.cargoType}
                                    className='flex gap-6 mt-2'
                                    onValueChange={value => handleChange('loadingMode', value)}
                                >
                           
                                    <div className='flex items-center gap-2'>
                                        <RadioGroupItem value='container' id='container' disabled={isReadOnly} />
                                        <Label htmlFor='container'>Контейнер</Label>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <RadioGroupItem value='wagon' id='wagon' disabled={isReadOnly} />
                                        <Label htmlFor='wagon'>Вагон</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className='flex gap-4'>
                                <div className='w-full'>
                                    <Label className='font-medium'>Заказчик</Label>
                                    <Select
                                        onValueChange={handleClientChange}
                                        defaultValue={formData.client?.organizationId?.toString()}
                                        disabled={isFetched}
                                    >
                                        <SelectTrigger className='mt-1'>
                                            <SelectValue placeholder='Выберите клиента' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map(client => (
                                                <SelectItem
                                                    key={client.organizationId}
                                                    value={client.organizationId.toString()}
                                                >
                                                    {client.organizationName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='w-full'>
                                    <div>
                                        <Label className='font-medium'>Получатель</Label>
                                        <Select
                                            disabled={isReadOnly}
                                            onValueChange={value => handleChange('recipient', value)}
                                            defaultValue={formData.customer?.organizationId?.toString()}
                                        >
                                            <SelectTrigger className='mt-1'>
                                                <SelectValue placeholder='Выберите получателя' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clients.map(customer => (
                                                    <SelectItem
                                                        key={customer.organizationId}
                                                        value={customer.organizationId.toString()}
                                                    >
                                                        {customer.organizationName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className='font-medium'>Контактное лицо:</Label>
                                        <p className='mt-1'>
                                            {formData.contactPerson || 'Иванов Иван | +7 998 851 6060'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-4 items-center'>
                                <Label className='font-medium min-w-24'>Тип перевозки</Label>
                                <div className='flex gap-4 items-center w-full'>
                                    <Select
                                        onValueChange={value => handleChange('vehicleType', value)}
                                        defaultValue={formData.vehicleProfile?.name?.toString()}
                                    >
                                        <SelectTrigger className='mt-1'>
                                            <SelectValue placeholder='Выберите профиль транспорта' />
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
                                <div className='w-24'>
                                    <div className='flex items-center mt-1'>
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
                                    <Label className='font-medium'>Дата погрузки</Label>
                                    <div className='flex gap-2 mt-1'>
                                        <Input
                                            type='date'
                                            value={format(new Date(formData.loadingDate || new Date()), 'yyyy-MM-dd')}
                                            onChange={e => handleChange('loadingDate', e.target.value)}
                                            readOnly={isReadOnly}
                                        />
                                        <div className='flex items-center justify-center px-4  text-[#00b6f1] font-medium'>
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
                                    <Label className='font-medium min-w-24'>Время подачи</Label>
                                    <Input
                                        type='time'
                                        className='mt-1'
                                        value={formData.filingTime || ''}
                                        onChange={e => handleChange('filingTime', e.target.value)}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center text-xl font-medium'>
                            Маршрут
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <Label className='font-medium'>Терминал 1</Label>
                                    <Select
                                        onValueChange={value => handleChange('terminal1', value)}
                                        defaultValue={formData.terminal1?.cityId?.toString()}
                                    >
                                        <SelectTrigger className='mt-1'>
                                            <SelectValue placeholder='Выберите терминал 1' />
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
                                    <Label className='font-medium'>Адрес</Label>
                                    <Input
                                        className='mt-1'
                                        value={formData.terminal1?.address || ''}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className='font-medium'>Склад клиента</Label>
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
                                <Label className='font-medium'>Терминал 2</Label>
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
                            <div className='text-xl font-medium'>Финансы</div>
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
                                    <Label htmlFor='priceRequest' className='font-medium'>
                                        Запрос цены
                                    </Label>
                                </div>

                                <div className='flex items-center'>
                                    <Label className='font-medium min-w-28'>Цена перевозки</Label>
                                    <Input
                                        type='text'
                                        className='w-full'
                                        name='price'
                                        value={formData.price || ''}
                                        onChange={e => handleChange('price', e.target.value)}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className='font-medium'>Доп услуги</Label>
                                <div className='space-y-2'>
                                    {formData.extraServices?.map((service, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Checkbox id={`service${index}`} checked={true} />
                                            <Label htmlFor={`service${index}`}>{service.name}</Label>
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
                                                    type='text'
                                                    value={service.price}
                                                    onChange={e =>
                                                        handleChange(`extraServices[${index}].price`, e.target.value)
                                                    }
                                                    className='w-32'
                                                    readOnly={isReadOnly}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='flex items-center'>
                                <Label className='font-medium w-full'>Полная стоимость рейса без НДС</Label>
                                <Input
                                    type='text'
                                    className='mt-1'
                                    value={formData.fullPrice || ''}
                                    onChange={e => handleChange('fullPrice', e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div>
                                <Label className='font-medium'>Груз</Label>
                                <Input
                                    className='mt-1'
                                    placeholder='Название груза'
                                    value={formData.cargoTitle || ''}
                                    onChange={e => handleChange('cargoTitle', e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div>
                                <Label className='font-medium'>Комментарии</Label>
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