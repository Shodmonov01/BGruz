import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'

function BidDate() {
    const { control, setValue } = useFormContext()
    const startDate = useWatch({ control, name: 'startDate' })
    const enableEndDate = useWatch({ control, name: 'enableEndDate' })
    const [today, setToday] = useState('')

    useEffect(() => {
        const todayDate = new Date().toISOString().split('T')[0]
        setToday(todayDate)
    }, [])

    useEffect(() => {
        if (!enableEndDate) {
            setValue('endDate', '')
        }
    }, [enableEndDate, setValue])

    return (
        <div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 py-6'>
                <h1 className='font-bold mr-11'>Дата Погрузки</h1>
                <div className='flex items-center gap-3'>
                    <FormField
                        control={control}
                        name='startDate'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type='date'
                                        {...field}
                                        value={field.value || ''}
                                        min={today}
                                        className='px-4 py-4 shadow-inner drop-shadow-xl'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <h3>ПО</h3>
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
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type='date'
                                        {...field}
                                        value={field.value || ''}
                                        min={
                                            startDate
                                                ? new Date(
                                                      new Date(startDate).setDate(new Date(startDate).getDate() + 1)
                                                  )
                                                      .toISOString()
                                                      .split('T')[0]
                                                : today
                                        } // Запрещаем выбирать тот же день
                                        className='px-4 py-4 shadow-inner drop-shadow-xl'
                                        disabled={!enableEndDate}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className='flex'>
                <h1 className='font-bold mr-16'>Время подачи</h1>
                <FormField
                    control={control}
                    name='submissionTime'
                    rules={{ required: 'Заполните это поле.' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type='time'
                                    {...field}
                                    value={field.value || ''}
                                    className='px-4 py-4 shadow-inner drop-shadow-xl'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default BidDate
