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
                            <SelectContent>
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
                                        setOperationType(value) // Обновляем родительское состояние
                                    }}
                                    defaultValue={field.value}
                                    className='flex flex-col space-y-1'
                                >
                                    <RadioGroupItem value='Погрузка' label='Погрузка' />
                                    <RadioGroupItem value='Выгрузка' label='Выгрузка' />
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                        setTransportType(value) // Обновляем родительское состояние
                                    }}
                                    defaultValue={field.value}
                                    className='flex flex-col space-y-1'
                                >
                                    <RadioGroupItem value='Контейнер' label='Контейнер' />
                                    <RadioGroupItem value='Вагон' label='Вагон' />
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default BidDetails
