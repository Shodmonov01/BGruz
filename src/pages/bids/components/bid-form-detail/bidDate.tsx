import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect } from 'react'
import DatePicker from '@/components/shared/date-picker'
import TimePicker from '@/components/shared/time-picker'

function BidDate() {
    const { control, setValue } = useFormContext()
    const startDate = useWatch({ control, name: 'startDate' })
    const enableEndDate = useWatch({ control, name: 'enableEndDate' })
    // const [today, setToday] = useState('')

    // useEffect(() => {
    //     const todayDate = new Date().toISOString().split('T')[0]
    //     setToday(todayDate)
    // }, [])

    useEffect(() => {
        if (!enableEndDate) {
            setValue('endDate', '')
        }
    }, [enableEndDate, setValue])

    return (
        <div>
            <div className='bg-slate-300 text-center text-[26px]  my-3 py-3'>
                                <p>Дата и время подачи</p>
                            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2 py-6 md:px-0 px-4 '>
                <p className='font-bold mr-11'>Дата подачи</p>
                <div className='flex items-center gap-3'>
        
                    <FormField
                        control={control}
                        name='startDate'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={date => field.onChange(date?.toISOString().split('T')[0])}
                                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <h3>по</h3>
                    <FormField
                        control={control}
                        name='enableEndDate'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={checked => setValue('enableEndDate', checked)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
               
                    <FormField
                        control={control}
                        name='endDate'
                        key={enableEndDate ? 'enabled' : 'disabled'}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={date => field.onChange(date?.toISOString().split('T')[0])}
                                        minDate={
                                            startDate
                                              ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1))
                                              : new Date(new Date().setHours(0, 0, 0, 0))
                                          }
                                          
                                        disabled={!enableEndDate}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>


           <div className='flex md:flex-col gap-5'>
           <div className='md:my-0 md:px-0 px-4 block md:flex '>
            <h1 className='font-bold mr-11 mb-2'>Срок доставки</h1>
                <div className='flex items-center gap-3'>
        
                    <FormField
                        control={control}
                        name='startDate'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={date => field.onChange(date?.toISOString().split('T')[0])}
                                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

      
               
            
                </div>
            </div>
            <div className=' block md:flex md:my-0 md:px-0 px-4'>
                <h1 className='font-bold mr-14 mb-2'>Время подачи</h1>
                <FormField
                    control={control}
                    name='submissionTime'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <TimePicker value={field.value} onChange={field.onChange} />
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

export default BidDate
