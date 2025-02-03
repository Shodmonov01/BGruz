// import { useState } from 'react'
// import { useFormContext, useWatch } from 'react-hook-form'
// import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Input } from '@/components/ui/input'
// import { Separator } from '@/components/ui/separator'
// import { Minus, Plus } from 'lucide-react'

// interface Client {
//     organizationId: number
//     organizationName: string
// }

// interface VehicleProfile {
//     id: number
//     name: string
// }

// interface BidDetailsProps {
//     filteredClients: Client[]
//     vehicleProfiles: VehicleProfile[]
//     handleClientChange: (value: string) => void
//     setOperationType: (value: string) => void
//     setTransportType: (value: string) => void
// }

// const BidDetails: React.FC<BidDetailsProps> = ({
//     filteredClients,
//     vehicleProfiles,
//     handleClientChange,
//     setOperationType,
//     setTransportType
// }) => {
//     const { control, setValue } = useFormContext()
//     const [open, setOpen] = useState(false)
//     const [search, setSearch] = useState('')
//     const [count, setCount] = useState(0)

//     const operationType = useWatch({ control, name: 'loadingMode' })

//     return (
//         <div>
//             <div className='flex flex-col md:flex-row items-start md:items-center gap2 md:gap-16 my-6'>
//                 <h1 className='font-bold'>Тип перевозки</h1>
//                 <FormField
//                     control={control}
//                     name='loadingMode'
//                     render={({ field }) => (
//                         <FormItem>
//                             {/* <FormLabel>Тип операции</FormLabel> */}
//                             <FormControl>
//                                 <RadioGroup
//                                     onValueChange={value => {
//                                         field.onChange(value)
//                                         setOperationType(value)
//                                     }}
//                                     defaultValue={field.value}
//                                     className='flex gap-6'
//                                 >
//                                     <FormItem className='flex items-center space-x-3 space-y-0 '>
//                                         <FormLabel className='font-normal'>Погрузка</FormLabel>
//                                         <FormControl>
//                                             <RadioGroupItem value='Погрузка' />
//                                         </FormControl>
//                                     </FormItem>
//                                     <FormItem className='flex items-center space-x-3 space-y-0'>
//                                         <FormControl>
//                                             <RadioGroupItem value='Выгрузка' />
//                                         </FormControl>
//                                         <FormLabel className='font-normal'>Выгрузка</FormLabel>
//                                     </FormItem>
//                                 </RadioGroup>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={control}
//                     name='transportType'
//                     render={({ field }) => (
//                         <FormItem>
//                             {/* <FormLabel>Тип транспорта</FormLabel> */}
//                             <FormControl>
//                                 <RadioGroup
//                                     onValueChange={value => {
//                                         field.onChange(value)
//                                         setTransportType(value)
//                                     }}
//                                     defaultValue={field.value}
//                                     className='flex gap-6'
//                                 >
//                                     <FormItem className='flex items-center space-x-3 space-y-0'>
//                                         <FormLabel className='font-normal'>Контейнер</FormLabel>
//                                         <FormControl>
//                                             <RadioGroupItem value='Контейнер' />
//                                         </FormControl>
//                                     </FormItem>
//                                     <FormItem className='flex items-center space-x-3 space-y-0'>
//                                         <FormControl>
//                                             <RadioGroupItem value='Вагон' />
//                                         </FormControl>
//                                         <FormLabel className='font-normal'>Вагон</FormLabel>
//                                     </FormItem>
//                                 </RadioGroup>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//             </div>

//             <Separator className='mb-4' />
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4'>
//                 {/* Выбор клиента */}
//                 <FormField
//                     control={control}
//                     name='client'
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel className='font-bold text-[18px]'>Заказчик</FormLabel>
//                             <Select
//                                 onValueChange={value => {
//                                     field.onChange(value)
//                                     handleClientChange(value)
//                                     setOpen(false)
//                                 }}
//                                 value={field.value}
//                                 open={open}
//                                 onOpenChange={setOpen}
//                             >
//                                 <FormControl>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder='Выберите клиента' />
//                                     </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent onCloseAutoFocus={e => e.preventDefault()}>
//                                     <div className='p-2'>
//                                         <Input
//                                             placeholder='Поиск клиента...'
//                                             value={search}
//                                             onChange={e => setSearch(e.target.value)}
//                                             onFocus={() => setOpen(true)}
//                                             onKeyDown={e => e.stopPropagation()}
//                                         />
//                                     </div>
//                                     {filteredClients.map(client => (
//                                         <SelectItem
//                                             key={client.organizationId}
//                                             value={client.organizationId.toString()}
//                                         >
//                                             {client.organizationName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div>
//                     <FormField
//                         control={control}
//                         name='recipientOrSender'
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel className='font-bold text-[18px]'>
//                                     {operationType === 'Погрузка' ? 'Отправитель' : 'Получатель'}
//                                 </FormLabel>
//                                 <Select onValueChange={value => field.onChange(value)} value={field.value}>
//                                     <FormControl>
//                                         <SelectTrigger>
//                                             <SelectValue
//                                                 placeholder={`Выберите ${operationType === 'Погрузка' ? 'отправителя' : 'получателя'}`}
//                                             />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         {filteredClients.map(client => (
//                                             <SelectItem
//                                                 key={client.organizationId}
//                                                 value={client.organizationId.toString()}
//                                             >
//                                                 {client.organizationName}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <div className='mt-1'>
//                         <h3>Контактное лицо:</h3>
//                         <h3>
//                             Иванов Иван | <a href='tel:+79988516060'>+79988516060</a>
//                         </h3>
//                     </div>
//                 </div>
//             </div>

//             {/* Выбор профиля транспорта */}
//             <div className='flex flex-col md:flex-row items-start md:items-center gap-2  my-6'>
//                 <h1 className='font-bold mr-20'>
//                     Профиль <br /> Транспорта
//                 </h1>

//                 <FormField
//                     control={control}
//                     name='vehicleProfiles' // Должно совпадать с defaultValues
//                     render={({ field }) => (
//                         <FormItem>
//                             <Select
//                                 onValueChange={value => {
//                                     field.onChange(value)
//                                     const selectedVehicleProfile = vehicleProfiles.find(
//                                         profile => profile.id.toString() === value
//                                     )
//                                     if (selectedVehicleProfile) {
//                                         setValue('vehicleProfiles', selectedVehicleProfile.id.toString()) // Используем id, так как это value
//                                     }
//                                 }}
//                                 value={field.value} // Должно правильно связываться
//                             >
//                                 <FormControl>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder='Выберите профиль транспорта' />
//                                     </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                     {vehicleProfiles.map(profile => (
//                                         <SelectItem key={profile.id} value={profile.id.toString()}>
//                                             {profile.name}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div className='flex items-center border rounded-lg overflow-hidden w-24 h-[37px]'>
//                     <div className='flex-1 flex items-center justify-center text-xl font-semibold'>{count}</div>
//                     <div className='flex flex-col border-l'>
//                         <button
//                             type='button'
//                             className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
//                             onClick={() => setCount(count + 1)}
//                         >
//                             <Plus size={14} className='text-green-500' />
//                         </button>
//                         <button
//                             type='button'
//                             className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
//                             onClick={() => setCount(Math.max(1, count - 1))}
//                         >
//                             <Minus size={14} className='text-yellow-500' />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default BidDetails

import { useState } from 'react'
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
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    // const [count, setCount] = useState(0)

    const operationType = useWatch({ control, name: 'loadingType' })

    return (
        <div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap2 md:gap-16 my-6'>
                <h1 className='font-bold'>Тип перевозки</h1>
                <FormField
                    control={control}
                    name='loadingType'
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
                                    className='flex gap-6'
                                >
                                    <FormItem className='flex items-center space-x-3 space-y-0 '>
                                        <FormLabel className='font-normal'>Погрузка</FormLabel>
                                        <FormControl>
                                            <RadioGroupItem value='Погрузка' />
                                        </FormControl>
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

                <FormField
                    control={control}
                    name='transportType'
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
                                    className='flex gap-6'
                                >
                                    <FormItem className='flex items-center space-x-3 space-y-0'>
                                        <FormLabel className='font-normal'>Контейнер</FormLabel>
                                        <FormControl>
                                            <RadioGroupItem value='Контейнер' />
                                        </FormControl>
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

            <Separator className='mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4'>
                {/* Выбор клиента */}
                <FormField
                    control={control}
                    name='client'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-bold text-[18px]'>Заказчик</FormLabel>
                            <Select
                                onValueChange={value => {
                                    field.onChange(Number(value))
                                    handleClientChange(value)
                                    setOpen(false)
                                }}
                                value={field.value?.toString()}
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
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold text-[18px]'>
                                    {operationType === 'loading' ? 'Отправитель' : 'Получатель'}
                                </FormLabel>
                                <Select onValueChange={value => field.onChange(value)} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={`Выберите ${operationType === 'Погрузка' ? 'отправителя' : 'получателя'}`}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {filteredClients.map(client => (
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
                    <div className='mt-1'>
                        <h3>Контактное лицо:</h3>
                        <h3>
                            Иванов Иван | <a href='tel:+79988516060'>+79988516060</a>
                        </h3>
                    </div>
                </div>
            </div>

            {/* Выбор профиля транспорта */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2  my-6'>
                <h1 className='font-bold mr-20'>
                    Профиль <br /> Транспорта
                </h1>

                <FormField
                    control={control}
                    name='vehicleProfiles'
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={value => {
                                    field.onChange(Number(value))
                                    setValue('vehicleProfiles', Number(value))
                                }}
                                value={field.value?.toString()}
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

                {/* <div className='flex items-center border rounded-lg overflow-hidden w-24 h-[37px]'>
                    <div className='flex-1 flex items-center justify-center text-xl font-semibold'>{count}</div>
                    <div className='flex flex-col border-l'>
                        <button
                            type='button'
                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                            onClick={() => setCount(count + 1)}
                        >
                            <Plus size={14} className='text-green-500' />
                        </button>
                        <button
                            type='button'
                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                            onClick={() => setCount(Math.max(1, count - 1))}
                        >
                            <Minus size={14} className='text-yellow-500' />
                        </button>
                    </div>
                </div> */}

                <FormField
                    control={control}
                    name='vehicleCount'
                    defaultValue={1} // Значение по умолчанию
                    render={({ field }) => (
                        <div className='flex items-center border rounded-lg overflow-hidden w-24 h-[37px] ml-4'>
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
    )
}

export default BidDetails
