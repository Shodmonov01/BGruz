import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format } from 'date-fns'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function Transportation({ formData, handleChange, clients, vehicleProfiles, isReadOnly, handleClientChange, isFetched }) {
    return (
        <div>
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
                                    <SelectItem key={client.organizationId} value={client.organizationId.toString()}>
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
                            <p className='mt-1'>{formData.contactPerson || 'Иванов Иван | +7 998 851 6060'}</p>
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
                                onChange={e => handleChange('vehicleCount', Number.parseInt(e.target.value))}
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
                            <div className='flex items-center justify-center px-4  text-[#00b6f1] font-medium'>ПО</div>
                            <Input type='date' value={formData.dueDate} className='flex-1' readOnly={isReadOnly} />
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
        </div>
    )
}

export default Transportation
