import { useEffect, useState } from 'react'
import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchPrivateData, postData } from '@/api/api' // Импортируем fetchPublicData

const bidFormSchema = z.object({
    client: z.string().min(1, { message: 'Client is required' }),
    loadingType: z.string().min(1, { message: 'Loading type is required' }),
    transportType: z.string().min(1, { message: 'Transport type is required' }),
    startDate: z.string().min(1, { message: 'Start date is required' }),
    endDate: z.string().min(1, { message: 'End date is required' }),
    terminal1Name: z.string().min(1, { message: 'Terminal 1 name is required' }),
    terminal1Address: z.string().min(1, { message: 'Terminal 1 address is required' }),
    terminal2Name: z.string().min(1, { message: 'Terminal 2 name is required' }),
    terminal2Address: z.string().min(1, { message: 'Terminal 2 address is required' }),
    warehouseName: z.string().min(1, { message: 'Warehouse name is required' }),
    warehouseAddress: z.string().min(1, { message: 'Warehouse address is required' }),
    price: z.number(),
    description: z.string().min(1, { message: 'Description is required' }),
    requestPrice: z.boolean()
})

type BidFormSchemaType = z.infer<typeof bidFormSchema>

const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    //@ts-ignore
    const [details, setDetails] = useState<{ organizationId: number; organizationName: string }[]>([])
    useEffect(() => {
        // Загружаем данные клиентов при монтировании компонента
        const loadClients = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const data = await fetchPrivateData('api/v1/organization/clients', token)
                setClients(data) // Сохраняем данные в состояние
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error)
            }
        }

        loadClients()
    }, [])

    useEffect(() => {
        // Загружаем данные клиентов при монтировании компонента
        const loadDetails = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const data = await fetchPrivateData('api/v1/organization/?organization_id=4751', token)
                console.log(data)

                setDetails(data) // Сохраняем данные в состояние
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error)
            }
        }

        loadDetails()
    }, [])

    const form = useForm<BidFormSchemaType>({
        resolver: zodResolver(bidFormSchema),
        defaultValues: {
            client: '',
            loadingType: '',
            transportType: '',
            startDate: '',
            endDate: '',
            terminal1Name: '',
            terminal1Address: '',
            terminal2Name: '',
            terminal2Address: '',
            warehouseName: '',
            warehouseAddress: '',
            price: 0,
            description: '',
            requestPrice: false
        }
    })

    const onSubmit = async (values: BidFormSchemaType) => {
        const payload = {
            ...values,
            price: Number(values.price) // Преобразуем price в число
        }

        try {
            await postData('/api/v1/bids', payload)
            modalClose()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)

    // Фильтрация клиентов по введенному тексту
    const filteredClients = clients.filter(client =>
        client.organizationName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='px-2'>
            <Heading title={'Создать новую заявку'} description={''} className='space-y-2 py-4 text-center' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' autoComplete='off'>
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='client'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Клиент</FormLabel>
                                    <Select
                                        onValueChange={value => {
                                            field.onChange(value)
                                            setOpen(false) // Закрываем селект после выбора
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
                                        <SelectContent
                                            onCloseAutoFocus={e => e.preventDefault()} // Предотвращаем автофокус Radix UI
                                        >
                                            {/* Поле поиска */}
                                            <div className='p-2'>
                                                <Input
                                                    placeholder='Поиск клиента...'
                                                    value={search}
                                                    onChange={e => setSearch(e.target.value)}
                                                    onFocus={() => setOpen(true)} // Держим селект открытым
                                                    onKeyDown={e => e.stopPropagation()} // Блокируем Radix UI навигацию
                                                />
                                            </div>

                                            {/* Отображение отфильтрованных клиентов */}
                                            {filteredClients.length > 0 ? (
                                                filteredClients.map(client => (
                                                    <SelectItem
                                                        key={client.organizationId}
                                                        value={client.organizationId.toString()}
                                                    >
                                                        {client.organizationName}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <p className='px-2 py-1 text-sm text-gray-500'>Клиенты не найдены</p>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-10'>
                            <FormField
                                control={form.control}
                                name='loadingType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Тип операции</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className='flex flex-col space-y-1'
                                            >
                                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                                    <FormControl>
                                                        <RadioGroupItem value='loading' />
                                                    </FormControl>
                                                    <FormLabel className='font-normal'>Погрузка</FormLabel>
                                                </FormItem>
                                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                                    <FormControl>
                                                        <RadioGroupItem value='unloading' />
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
                                control={form.control}
                                name='transportType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Тип транспорта</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className='flex flex-col space-y-1'
                                            >
                                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                                    <FormControl>
                                                        <RadioGroupItem value='container' />
                                                    </FormControl>
                                                    <FormLabel className='font-normal'>Контейнер</FormLabel>
                                                </FormItem>
                                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                                    <FormControl>
                                                        <RadioGroupItem value='wagon' />
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
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='startDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Начальная дата</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='date'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='endDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Конечная дата</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='date'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold'>Терминал 1</h3>
                            <FormField
                                control={form.control}
                                name='terminal1Name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Название'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='terminal1Address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Адрес</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Адрес'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold'>Терминал 2</h3>
                            <FormField
                                control={form.control}
                                name='terminal2Name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Название'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='terminal2Address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Адрес</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Адрес'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold'>Склад клиента</h3>
                            <FormField
                                control={form.control}
                                name='warehouseName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Название'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='warehouseAddress'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Адрес</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Адрес'
                                                {...field}
                                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Цена</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='Цена'
                                            {...field}
                                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                                            value={field.value || ''} // Убедимся, что значение не undefined
                                            onChange={e => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Описание'
                                            {...field}
                                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='requestPrice'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Запрос цены</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex items-center justify-center gap-4'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='rounded-full'
                            size='lg'
                            onClick={modalClose}
                        >
                            Отмена
                        </Button>
                        <Button type='submit' className='rounded-full' size='lg'>
                            Создать заявку
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default StudentCreateForm
