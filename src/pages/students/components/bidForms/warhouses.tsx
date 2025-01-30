import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

function Warhouses({ warehouses }) {
    const { control, setValue } = useFormContext()

    return (
        <div className='grid grid-cols-2 gap-4'>
            {/* <h3 className='text-lg font-semibold'>Склад клиента</h3> */}
            <FormField
                control={control}
                name='warehouseName'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Склад клиента</FormLabel>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                const selectedWarehouse = warehouses.find(w => w.name === value)
                                setValue('warehouseAddress', selectedWarehouse?.description || '')
                            }}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder='Выберите склад' />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {warehouses.map(warehouse => (
                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name='warehouseAddress'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Адрес</FormLabel>
                        <FormControl>
                            <Input
                                placeholder='Адрес склада'
                                {...field}
                                className='px-4 py-3 shadow-inner drop-shadow-xl'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default Warhouses
