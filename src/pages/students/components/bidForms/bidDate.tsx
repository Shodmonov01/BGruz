import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

function BidDate() {
    const { control } = useFormContext()

    return (
        <div className='grid grid-cols-2 gap-4'>
            <FormField
                control={control}
                name='startDate'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>С</FormLabel>
                        <FormControl>
                            <Input type='date' {...field} className='px-4 py-6 shadow-inner drop-shadow-xl' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name='endDate'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>ПО</FormLabel>
                        <FormControl>
                            <Input type='date' {...field} className='px-4 py-6 shadow-inner drop-shadow-xl' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default BidDate
