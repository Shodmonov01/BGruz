import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

function BidDetails({ formData, handleChange, isReadOnly, clients, handleClientChange, isFetched, vehicleProfiles }) {
    return (
        <>
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
                            <RadioGroupItem className='size-5' value='loading' id='loading' disabled={isReadOnly} />
                        </div>
                        <div className='flex items-center gap-2'>
                            <RadioGroupItem className='size-5' value='unloading' id='unloading' disabled={isReadOnly} />
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
                            <RadioGroupItem className='size-5' value='container' id='container' disabled={isReadOnly} />
                        </div>
                        <div className='flex items-center gap-2'>
                            <RadioGroupItem className='size-5' value='wagon' id='wagon' disabled={isReadOnly} />
                            <Label htmlFor='wagon'>Вагон</Label>
                        </div>
                    </RadioGroup>
                </div>
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

            <div className='space-y-4'>
                <div className='flex gap-4 items-center'>
                    <Label className=' min-w-36  text-[18px] font-bold text-[#1E293B]'>Тип перевозки</Label>
                    <div className='flex gap-4 items-center w-full'>
                        <Select
                            disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                        <Label className='text-[18px] font-bold text-[#1E293B] '>Дата погрузки</Label>
                        <div className='flex gap-2 mt-1 relative left-4'>
                            <Input
                                type='date'
                                value={formData.loadingDate}
                                onChange={e => handleChange('loadingDate', e.target.value)}
                                readOnly={isReadOnly}
                            />
                            <div className='flex items-center gap-2'>
                                <div className='text-[#00b6f1] font-medium'>ПО</div>
                                <Checkbox
                                    disabled={isReadOnly}
                                    id='enableEndDate'
                                    checked={formData.enableEndDate || false}
                                    onCheckedChange={checked => handleChange('enableEndDate', checked)}
                                />
                            </div>
                            <Input
                                type='date'
                                value={formData.dueDate}
                                className='flex-1'
                                readOnly={isReadOnly}
                                disabled={!formData.enableEndDate}
                                onChange={e => handleChange('dueDate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Label className='text-[18px] font-bold text-[#1E293B] min-w-36'>Время подачи</Label>
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
        </>
    )
}

export default BidDetails
