import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

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
    const requestPrice = useWatch({ control, name: 'requestPrice' })

    useEffect(() => {
        if (extraServices.length > 0) {
            setServices(
                extraServices.map(service => ({
                    ...service,
                    count: service.countIncluded || 1,
                    checked: false
                }))
            )
        }
    }, [extraServices])

    console.log('services:', services)

    useEffect(() => {
        if (extraServices.length > 0) {
            const uniqueServices = Array.from(new Map(extraServices.map(service => [service.id, service])).values())

            setServices(
                uniqueServices.map(service => ({
                    ...service,
                    count: 1,
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
    const handleCheckboxChange = (index: number) => {
        const updatedServices = [...services]
        updatedServices[index].checked = !updatedServices[index].checked
        updatedServices[index].count = updatedServices[index].checked ? 1 : 1
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
            setValue('price', '')
        }
    }, [requestPrice, setValue])

    const totalSum =
        (watch('price') || 0) +
        services.reduce((acc, service) => acc + (service.checked ? service.count * service.price : 0), 0)

    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '')
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }

    return (
        <div className='space-y-4 flex flex-col-reverse md:block'>
            <div>
                <div className='bg-slate-300 text-center text-[26px] my-3 py-3'>
                    <h1>Финансы</h1>
                </div>
                <h1 className='text-center'>Все цены указаны без НДС</h1>
                <p className='md:hidden block md:px-0 px-4 mt-5 mb-[-8px]'>Цена перевозки</p>

                <div className='flex items-center py-4 justify-between md:px-0 px-4'>
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
                        <p className='hidden md:block'>Цена перевозки</p>


                        <FormField
                            control={control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder='Цена'
                                            {...field}
                                            className=''
                                            value={requestPrice ? '' : formatNumber(field.value?.toString() || '')}
                                            onChange={e => {
                                                const rawValue = e.target.value.replace(/\D/g, '')
                                                field.onChange(rawValue ? Number(rawValue) : '')
                                            }}
                                            disabled={requestPrice}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='space-y-4'>
                    <div className='flex items-center py-4 justify-between bg-secondary md:bg-transparent'>
                        <p className='font-bold md:px-0 px-4'>Доп услуги</p>
                    </div>

                    {services.length === 0 ? (
                        <p className='text-gray-500'>Нет доступных доп. услуг или же выберите клиента</p>
                    ) : (
                        services.map((service, index) => (
                            <div key={service.id} className='flex items-center justify-between gap-4 md:px-0 px-4'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox
                                        checked={service.checked}
                                        onCheckedChange={() => handleCheckboxChange(index)}
                                    />
                                    <p className='text-base font-bold w-1/2'>{service.name}</p>
                                </div>
                                <div className='flex gap-5'>
                                    <Input
                                        type='number'
                                        min='1'
                                        max={service.maxCount}
                                        value={service.count}
                                        onChange={e => handleCountChange(index, parseInt(e.target.value) || 1)}
                                        className='w-16 text-center'
                                        disabled={!service.checked}
                                    />

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

                    <div className='flex justify-between items-center gap-2 font-bold text-lg py-4 md:px-0 px-4'>
                        <span className='text-base md:text-xl w-1/2'>Полная стоимость рейса без НДС:</span>{' '}
                        <Input type='text' readOnly value={totalSum.toLocaleString()} className='w-1/2 text-center' />
                    </div>
                </div>
            </div>

            <div>
                <div className=' md:py-0 py-2 mb-10'>
                    <div className='bg-slate-300 text-center text-[26px]  my-3 py-3'>
                        <p>Груз</p>
                    </div>
                    <div className='md:px-0 px-4'>
                         <FormField
                        control={control}
                        name='cargoTitle'
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel className='text-base md:text-xl'>Груз</FormLabel> */}
                                <FormControl>
                                    <Input
                                        placeholder='Груз'
                                        {...field}
                                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                   
                </div>
                <div className='md:px-0 px-4 '>
                    <FormField
                        control={control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-base md:text-xl'>Комментарии</FormLabel>
                                <FormControl>
                                    <Textarea
                                        // className='min-w-full max-w-[300px] min-h-[40px] max-h-[300px] p-2 border rounded-md resize focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        placeholder='Комментарии'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default BidDescribe
