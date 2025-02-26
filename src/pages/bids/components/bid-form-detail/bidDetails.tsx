import { useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus } from 'lucide-react'

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
    // const [open, setOpen] = useState(false)
    // const [search, setSearch] = useState('')
    // const [count, setCount] = useState(0)
    const [openClient, setOpenClient] = useState(false)
    const [openRecipient, setOpenRecipient] = useState(false)
    const [searchClient, setSearchClient] = useState('')
    const [searchRecipient, setSearchRecipient] = useState('')

    const filteredClientList = filteredClients.filter(client =>
        client.organizationName.toLowerCase().includes(searchClient.toLowerCase())
    )

    const filteredRecipientList = filteredClients.filter(client =>
        client.organizationName.toLowerCase().includes(searchRecipient.toLowerCase())
    )

    const operationType = useWatch({ control, name: 'loadingType' })

    const inputRef = useRef<HTMLInputElement | null>(null);


    return (
        <div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-16 my-6 md:px-0 px-4'>
                <h1 className='font-bold'>Тип перевозки</h1>
                <FormField
                    control={control}
                    name='loadingType'
                    rules={{ required: 'Заполните это поле.' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={value => {
                                        const mappedValue = value === 'Погрузка' ? 'loading' : 'unloading'
                                        field.onChange(mappedValue)
                                        setOperationType(mappedValue)
                                    }}
                                    defaultValue={field.value}
                                    className='flex md:gap-6 gap-12 ml-16 md:ml-auto'
                                >
                                    <FormItem className='flex items-center space-x-3 space-y-0 '>
                                        <FormLabel className='font-normal'>Погрузка</FormLabel>
                                        <FormControl>
                                            <RadioGroupItem value='Погрузка' className=' size-8' />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='Выгрузка' className=' size-8' />
                                        </FormControl>
                                        <FormLabel className='font-normal'>Выгрузка</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='transportType'
                    rules={{ required: 'Заполните это поле.' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={value => {
                                        const mappedValue = value === 'Контейнер' ? 'container' : 'wagon'
                                        field.onChange(mappedValue)
                                        setTransportType(value)
                                    }}
                                    defaultValue={field.value}
                                    className='flex md:gap-6 gap-12 ml-[54px] md:ml-auto'
                                >
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormLabel className='font-normal'>Контейнер</FormLabel>
                                        <FormControl>
                                            <RadioGroupItem value='Контейнер' className=' size-8' />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormControl>
                                            <RadioGroupItem value='Вагон' className=' size-8' />
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

            <Separator className='mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 md:px-0 px-4'>
                {/* <FormField
                    control={control}
                    name='client'
                    rules={{ required: 'Заполните это поле.' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-bold text-[18px]'>Заказчик</FormLabel>
                            <Select
                                onValueChange={value => {
                                    field.onChange(Number(value))
                                    handleClientChange(value)
                                    setOpenClient(false)
                                }}
                                value={field.value?.toString()}
                                open={openClient}
                                onOpenChange={setOpenClient}
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
                                            value={searchClient}
                                            onChange={e => setSearchClient(e.target.value)}
                                            onFocus={() => setOpenClient(true)}
                                            onKeyDown={e => e.stopPropagation()}
                                        />
                                    </div>
                                    {filteredClientList.map(client => (
                                        <SelectItem
                                            key={client.organizationId}
                                            value={client.organizationId.toString()}
                                        >
                                            {client.organizationName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

<FormField
    control={control}
    name='client'
    rules={{ required: 'Заполните это поле.' }}
    render={({ field }) => (
        <FormItem>
            <FormLabel className='font-bold text-[18px]'>Заказчик</FormLabel>
            <Select
                onValueChange={value => {
                    field.onChange(Number(value));
                    handleClientChange(value);
                    setSearchClient(''); // Очистка поискового поля при выборе
                    setOpenClient(false);
                }}
                value={searchClient || field.value?.toString()} // Отображаем введенный текст
                open={openClient}
                onOpenChange={open => {
                    setOpenClient(open);
                    if (open) {
                        setTimeout(() => {
                            inputRef.current?.focus(); // Теперь TypeScript понимает, что это input
                        }, 100);
                    }
                }}
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder='Выберите клиента' />
                    </SelectTrigger>
                </FormControl>
                <SelectContent onCloseAutoFocus={e => e.preventDefault()}>
                    <div className='p-2'>
                        <Input
                            ref={inputRef}
                            placeholder='Поиск клиента...'
                            value={searchClient}
                            onChange={e => setSearchClient(e.target.value)}
                            onFocus={() => setOpenClient(true)}
                            onKeyDown={e => e.stopPropagation()}
                        />
                    </div>
                    {filteredClientList.map(client => (
                        <SelectItem
                            key={client.organizationId}
                            value={client.organizationId.toString()}
                        >
                            {client.organizationName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    )}
/>
                <div>
                    <FormField
                        control={control}
                        name='recipientOrSender'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold text-[18px]'>
                                    {operationType === 'loading' ? 'Отправитель' : 'Получатель'}
                                </FormLabel>
                                <Select
                                    onValueChange={value => field.onChange(value)}
                                    value={field.value}
                                    open={openRecipient}
                                    onOpenChange={setOpenRecipient}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={`Выберите ${operationType === 'loading' ? 'отправителя' : 'получателя'}`}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    {/* <SelectContent>
                                        {filteredClients.map(client => (
                                            <SelectItem
                                                key={client.organizationId}
                                                value={client.organizationId.toString()}
                                            >
                                                {client.organizationName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent> */}
                                    <SelectContent onCloseAutoFocus={e => e.preventDefault()}>
                                        <div className='p-2'>
                                            <Input
                                                placeholder='Поиск...'
                                                value={searchRecipient}
                                                onChange={e => setSearchRecipient(e.target.value)}
                                                onFocus={() => setOpenRecipient(true)}
                                                onKeyDown={e => e.stopPropagation()}
                                            />
                                        </div>
                                        {filteredRecipientList.map(client => (
                                            <SelectItem
                                                key={client.organizationId}
                                                value={client.organizationId.toString()}
                                            >
                                                {client.organizationName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <div className='mt-1'>
                        <h3>Контактное лицо:</h3>
                        <h3>
                            Иванов Иван | <a href='tel:+79988516060'>+79988516060</a>
                        </h3>
                    </div> */}
                </div>
            </div>

            <div className='bg-slate-300 text-center text-[26px]  my-3 py-3'>
                <p>Транспорт</p>
            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2  my-6 md:px-0 px-4 md:py-0 py-3'>
                {/* <h1 className='font-bold mr-20'>
                    Профиль <br className='hidden md:block' /> Транспорта
                </h1> */}

                <div className='flex gap-3 w-full items-center'>
                    <div className='w-2/3'>
                        <FormField
                            control={control}
                            name='vehicleProfiles'
                            rules={{ required: 'Заполните это поле.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={value => {
                                            field.onChange(Number(value))
                                            setValue('vehicleProfiles', Number(value))
                                        }}
                                        value={field.value?.toString()}
                                        required
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Профиль ТС' />
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
                    <div className='w-1/3'>
                        <FormField
                            control={control}
                            name='vehicleCount'
                            defaultValue={1}
                            render={({ field }) => (
                                <div className='flex items-center border rounded-lg overflow-hidden h-[51px] '>
                                    <div className='flex-1 flex items-center justify-center text-xl font-semibold'>
                                        {field.value}
                                    </div>
                                    <div className='flex flex-col border-l'>
                                        <button
                                            type='button'
                                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                            onClick={() => field.onChange(field.value + 1)}
                                        >
                                            <Plus size={14} className='text-green-500' />
                                        </button>
                                        <button
                                            type='button'
                                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                            onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                        >
                                            <Minus size={14} className='text-yellow-500' />
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
            {/* <div className='block md:hidden md:px-0 px-4'>
                <h1 className='font-bold mr-20'>Количество</h1>
                <FormField
                    control={control}
                    name='vehicleCount'
                    defaultValue={1}
                    render={({ field }) => (
                        <div className='flex items-center border rounded-lg overflow-hidden w-24 h-[37px] ml-0 md:ml-4 mt-4 md:mt-0'>
                            <div className='flex-1 flex items-center justify-center text-xl font-semibold'>
                                {field.value}
                            </div>
                            <div className='flex flex-col border-l'>
                                <button
                                    type='button'
                                    className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                    onClick={() => field.onChange(field.value + 1)}
                                >
                                    <Plus size={14} className='text-green-500' />
                                </button>
                                <button
                                    type='button'
                                    className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                >
                                    <Minus size={14} className='text-yellow-500' />
                                </button>
                            </div>
                        </div>
                    )}
                />
            </div> */}
        </div>
    )
}

export default BidDetails
