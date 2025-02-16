import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'

interface ExtraService {
    id: number
    name: string
    price: number
    countIncluded?: number
    maxCount?: number
}

interface Service extends ExtraService {
    count: number
    checked: boolean
}

interface BidDescribeProps {
    extraServices: ExtraService[]
}

function BidDescribe({ extraServices }: BidDescribeProps) {
    const { control, setValue, watch } = useFormContext()
    const [services, setServices] = useState<Service[]>([])
    const requestPrice = useWatch({ control, name: 'requestPrice' }) // Следим за чекбоксом

    // Обновляем services, когда extraServices загружается
    useEffect(() => {
        if (extraServices.length > 0) {
            setServices(
                extraServices.map(service => ({
                    ...service,
                    count: service.countIncluded || 1, // Минимальное значение 1
                    checked: false // Добавляем флаг выбора
                }))
            )
        }
    }, [extraServices])

    console.log('services:', services) // Теперь данные должны появиться

    useEffect(() => {
        if (extraServices.length > 0) {
            const uniqueServices = Array.from(new Map(extraServices.map(service => [service.id, service])).values())

            setServices(
                uniqueServices.map(service => ({
                    ...service,
                    count: 1, // Всегда начинаем с 1
                    checked: false
                }))
            )
        }
    }, [extraServices])

    const handleCountChange = (index, value) => {
        const updatedServices = [...services]
        updatedServices[index].count = value
        setServices(updatedServices)
        updateFormData(updatedServices)
    }

    // const handleCheckboxChange = index => {
    //     const updatedServices = [...services]
    //     updatedServices[index].checked = !updatedServices[index].checked
    //     setServices(updatedServices)
    //     updateFormData(updatedServices)
    // }

    const handleCheckboxChange = (index: number) => {
        const updatedServices = [...services]
        updatedServices[index].checked = !updatedServices[index].checked
        updatedServices[index].count = updatedServices[index].checked ? 1 : 1 // Устанавливаем 1, если выбрана
        setServices(updatedServices)
        updateFormData(updatedServices)
    }

    const updateFormData = updatedServices => {
        setValue(
            'extraServices',
            updatedServices.filter(service => service.checked)
        )
    }

    useEffect(() => {
        if (requestPrice) {
            setValue('price', '') // Очищаем цену
        }
    }, [requestPrice, setValue])

    // const totalSum = services.reduce((acc, service) => acc + (service.checked ? service.count * service.price : 0), 0)
    const totalSum =
        (watch('price') || 0) +
        services.reduce((acc, service) => acc + (service.checked ? service.count * service.price : 0), 0)

    // Функция для форматирования числа с разрядностью
    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '') // Убираем все нечисловые символы
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }

    return (
        <div className='space-y-4'>
            <h1 className='text-center text-red-600 font-bold'>Все цены указаны без НДС</h1>
            <div className='flex items-center py-4 justify-between'>
                <FormField
                    control={control}
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
                <div className='flex items-center gap-4'>
                    <p>Цена</p>

                    <FormField
                        control={control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type='text' // Используем text, чтобы можно было форматировать ввод
                                        placeholder='Цена'
                                        {...field}
                                        className='px-4 py-4 shadow-inner drop-shadow-xl'
                                        value={requestPrice ? '' : formatNumber(field.value?.toString() || '')}
                                        onChange={e => {
                                            const rawValue = e.target.value.replace(/\D/g, '') // Убираем все нечисловые символы
                                            field.onChange(rawValue ? Number(rawValue) : '') // Записываем только число
                                        }}
                                        disabled={requestPrice} // Блокируем поле, если включен "Запрос цены"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            {/* Доп Услуги */}

            <div className='space-y-4'>
                <div className='flex items-center py-4 justify-between'>
                    <p className='font-bold'>Доп услуги</p>
                </div>

                {services.length === 0 ? (
                    <p className='text-gray-500'>Нет доступных доп. услуг или же выберите клиента</p>
                ) : (
                    services.map((service, index) => (
                        <div key={service.id} className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    checked={service.checked}
                                    onCheckedChange={() => handleCheckboxChange(index)}
                                />
                                <p className=''>{service.name}</p>
                            </div>
                            <div className='flex gap-5'>
                                <Input
                                    type='number'
                                    min='1'
                                    max={service.maxCount}
                                    value={service.count}
                                    onChange={e => handleCountChange(index, parseInt(e.target.value) || 1)}
                                    className='w-16 text-center'
                                    disabled={!service.checked} // Отключаем, если чекбокс не активен
                                />

                                {/* <Input
                                    type='number'
                                    min='1'
                                    max={service.maxCount}
                                    value={service.count}
                                    onChange={e => handleCountChange(index, parseInt(e.target.value) || 1)}
                                    className='w-16 text-center'
                                    disabled={!service.checked}
                                /> */}
                                <Input
                                    type='text'
                                    readOnly
                                    value={service.checked ? (service.count * service.price).toLocaleString() : '0'}
                                    className='w-20 text-center text-blue-600'
                                />
                            </div>
                        </div>
                    ))
                )}

                <div className='flex justify-end items-center gap-2 font-bold text-lg py-4'>
                    <span className='text-red-600'>Полная стоимость рейса без НДС:</span>{' '}
                    <Input type='text' readOnly value={totalSum.toLocaleString()} className='w-48 text-center' />
                </div>
            </div>

            {/* Описание */}
            <FormField
                control={control}
                name='cargoTitle'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Груз</FormLabel>
                        <FormControl>
                            <Input placeholder='Груз' {...field} className='px-4 py-6 shadow-inner drop-shadow-xl' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name='description'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                            <textarea
                                className='min-w-full max-w-[300px] min-h-[40px] max-h-[300px] p-2 border rounded-md resize focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Описание'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default BidDescribe
