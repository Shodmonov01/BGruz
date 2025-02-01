// import { useFormContext } from 'react-hook-form'
// import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'

// function BidDate() {
//     const { control } = useFormContext()

//     return (
//         // <div className='grid grid-cols-2 gap-4'>
//         <div className='flex items-center gap-4 py-6'>
//             <h1 className='font-bold mr-11'>Дата Погрузки</h1>
//             <FormField
//                 control={control}
//                 name='startDate'
//                 render={({ field }) => (
//                     <FormItem>
//                         {/* <FormLabel>С</FormLabel> */}
//                         <FormControl>
//                             <Input type='date' {...field} className='px-4 py-4 shadow-inner drop-shadow-xl' />
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />
//             <h3>ПО</h3>
//             <FormField
//                 control={control}
//                 name='endDate'
//                 render={({ field }) => (
//                     <FormItem>
//                         {/* <FormLabel>ПО</FormLabel> */}
//                         <FormControl>
//                             <Input type='date' {...field} className='px-4 py-4 shadow-inner drop-shadow-xl' />
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />
//         </div>
//     )
// }

// export default BidDate


import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

function BidDate() {
    const { control, setValue } = useFormContext()
    const startDate = useWatch({ control, name: 'startDate' })
    const [today, setToday] = useState('')

    useEffect(() => {
        const todayDate = new Date().toISOString().split('T')[0]
        setToday(todayDate)
    }, [])

    return (
        <div className='flex flex-col md:flex-row items-start md:items-center gap-4 py-6'>
            <h1 className='font-bold mr-11'>Дата Погрузки</h1>
            <FormField
                control={control}
                name='startDate'
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                type='date'
                                {...field}
                                min={today} // Запрещаем выбирать прошлые даты
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
                name='endDate'
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                type='date'
                                {...field}
                                min={startDate || today} // Запрещаем выбирать дату раньше startDate
                                className='px-4 py-4 shadow-inner drop-shadow-xl'
                                onChange={(e) => {
                                    if (e.target.value < startDate) {
                                        setValue('endDate', startDate)
                                    } else {
                                        field.onChange(e)
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default BidDate
