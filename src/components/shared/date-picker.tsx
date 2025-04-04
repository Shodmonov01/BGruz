import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

interface DatePickerProps {
    value: Date | undefined
    onChange: (date: Date | undefined) => void
    minDate?: Date
    disabled?: boolean
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate, disabled }) => {
    return (
        <Popover>
            <PopoverTrigger asChild disabled={disabled}>
                <Button variant='outlineSecondary' className='w-full justify-start text-left px-3 py-5 md:px-4 md:py-6 text-base md:text-xl' disabled={disabled}>
                    {value ? format(value, 'dd.MM.yyyy') : 'Выберите дату'}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    mode='single'
                    selected={value}
                    onSelect={date => {
                        if (date) {
                            const fixedDate = new Date(date)
                            fixedDate.setHours(12, 0, 0, 0)
                            onChange(fixedDate)
                        } else {
                            onChange(undefined)
                        }
                    }}
                    initialFocus
                    disabled={date => disabled || Boolean(minDate && date < minDate)}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker


// import * as React from 'react'
// import { format } from 'date-fns'
// import { Calendar as CalendarIcon } from 'lucide-react'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Calendar } from '@/components/ui/calendar'
// import { Button } from '@/components/ui/button'
// import { DateRange } from 'react-day-picker'

// interface DatePickerProps {
//     value: DateRange | undefined
//     onChange: (range: DateRange | undefined) => void
//     minDate?: Date
//     disabled?: boolean
// }

// const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate, disabled }) => {
//     return (
//         <Popover>
//             <PopoverTrigger asChild disabled={disabled}>
//                 <Button variant='outlineSecondary' className='w-full justify-start text-left px-3 py-5 md:px-4 md:py-6 text-base md:text-xl' disabled={disabled}>
//                     {value?.from ? (
//                         value.to ? (
//                             <>
//                                 {format(value.from, 'dd.MM.yyyy')} - {format(value.to, 'dd.MM.yyyy')}
//                             </>
//                         ) : (
//                             format(value.from, 'dd.MM.yyyy')
//                         )
//                     ) : (
//                         'Выберите дату'
//                     )}
//                     <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className='w-auto p-0'>
//                 <Calendar
//                     mode='range'
//                     selected={value}
//                     onSelect={range => {
//                         if (range?.from) {
//                             const fixedFrom = new Date(range.from)
//                             fixedFrom.setHours(12, 0, 0, 0)
                            
//                             let fixedTo: Date | undefined = undefined
//                             if (range.to) {
//                                 fixedTo = new Date(range.to)
//                                 fixedTo.setHours(12, 0, 0, 0)
//                             }
                            
//                             onChange({ from: fixedFrom, to: fixedTo })
//                         } else {
//                             onChange(undefined)
//                         }
//                     }}
//                     initialFocus
//                     disabled={date => disabled || Boolean(minDate && date < minDate)}
//                 />
//             </PopoverContent>
//         </Popover>
//     )
// }

// export default DatePicker