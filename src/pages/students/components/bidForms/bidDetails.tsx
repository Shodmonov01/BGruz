import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'

interface Client {
    organizationId: number
    organizationName: string
}

interface VehicleProfile {
    id: number
    name: string
}

interface BidDetailsProps {
    filteredClients: Client[]
    vehicleProfiles: VehicleProfile[]
    handleClientChange: (value: string) => void
    setOperationType: (value: string) => void
    setTransportType: (value: string) => void
}

const BidDetails: React.FC<BidDetailsProps> = ({
    filteredClients,
    vehicleProfiles,
    handleClientChange,
    setOperationType,
    setTransportType
}) => {
    const { control, setValue } = useFormContext()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    return (
        <div>
            {/* Выбор клиента */}
            <FormField
                control={control}
                name='client'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Клиент</FormLabel>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                handleClientChange(value)
                                setOpen(false)
                            }}
                            value={field.value}
                            open={open}
                            onOpenChange={setOpen}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder='Выберите клиента' />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent onCloseAutoFocus={e => e.preventDefault()}>
                                <div className='p-2'>
                                    <Input
                                        placeholder='Поиск клиента...'
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        onFocus={() => setOpen(true)}
                                        onKeyDown={e => e.stopPropagation()}
                                    />
                                </div>
                                {filteredClients.map(client => (
                                    <SelectItem key={client.organizationId} value={client.organizationId.toString()}>
                                        {client.organizationName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className='flex gap-10'>
                {/* Выбор типа операции */}
                <FormField
                    control={control}
                    name='loadingType'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тип операции</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={value => {
                                        field.onChange(value)
                                        setOperationType(value)
                                    }}
                                    defaultValue={field.value}
                                    className='flex flex-col space-y-1'
                                >
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='Погрузка' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Погрузка</FormLabel>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='Выгрузка' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Выгрузка</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Выбор типа транспорта */}
                <FormField
                    control={control}
                    name='transportType'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тип транспорта</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={value => {
                                        field.onChange(value)
                                        setTransportType(value)
                                    }}
                                    defaultValue={field.value}
                                    className='flex flex-col space-y-1'
                                >
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='Контейнер' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Контейнер</FormLabel>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='Вагон' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Вагон</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Выбор профиля транспорта */}
            <FormField
                control={control}
                name='vehicleProfile'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Профиль Транспорта</FormLabel>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                const selectedVehicleProfile = vehicleProfiles.find(
                                    profile => profile.id.toString() === value
                                )
                                if (selectedVehicleProfile) {
                                    setValue('vehicleProfile', selectedVehicleProfile.name)
                                }
                            }}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder='Выберите профиль транспорта' />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {vehicleProfiles.map(profile => (
                                    <SelectItem key={profile.id} value={profile.id.toString()}>
                                        {profile.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default BidDetails
