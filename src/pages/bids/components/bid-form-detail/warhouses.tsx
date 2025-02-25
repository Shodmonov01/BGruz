import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'

function Warehouses({ warehouses }) {
    const { control, watch, setValue } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'warehouses'
    })
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState<Record<number, boolean>>({})
    console.log(warehouses)

    const sortedWarehouses = [...warehouses]
        .sort((a, b) => a.name.localeCompare(b.name)) // Сортировка по алфавиту
        .filter(w => w.name.toLowerCase().includes(search.toLowerCase())) // Фильтрация

    useEffect(() => {
        if (fields.length === 0) {
            append({ name: '', address: '' })
        }
    }, [fields.length, append])

    useEffect(() => {
        fields.forEach((field, index) => {
            const selectedWarehouseId = watch(`warehouses.${index}.name`)
            const selectedWarehouse = warehouses.find(w => w.id.toString() === selectedWarehouseId)

            if (selectedWarehouse) {
                setValue(`warehouses.${index}.address`, selectedWarehouse.description || '')
            }
        })
    }, [watch, fields, warehouses, setValue])

    const addWarehouse = () => append({ name: '', address: '' })
    const removeWarehouse = index => remove(index)

    return (
        <div className='md:mb-0 mb-6'>
            <h1 className='font-bold mb-2'>Склад клиента</h1>
            {fields.map((field, index) => (
                <div key={field.id} className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mb-2'>
                    <FormField
                        control={control}
                        name={`warehouses.${index}.name`}
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    open={!!isOpen[index]}
                                    // onOpenChange={setIsOpen}
                                    onOpenChange={isOpen => setIsOpen(prev => ({ ...prev, [index]: isOpen }))}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Выберите склад' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Поле для поиска */}
                                        <div className='p-2'>
                                            <Input
                                                placeholder='Поиск склада...'
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                onKeyDown={e => e.stopPropagation()}
                                                onFocus={() => setIsOpen(prev => ({ ...prev, [index]: true }))}
                                                className='w-full px-3 py-2 border rounded-md'
                                            />
                                        </div>
                                        {/* Список складов */}
                                        {sortedWarehouses.length > 0 ? (
                                            sortedWarehouses.map(warehouse => (
                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                    {warehouse.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className='p-2 text-center text-gray-500'>Ничего не найдено</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='flex gap-1'>
                        <FormField
                            control={control}
                            name={`warehouses.${index}.address`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder='Адрес'
                                            {...field}
                                            className={`px-4 py-3 shadow-inner drop-shadow-xl ${
                                                fields.length > 1 ? 'w-[310px]' : 'w-[345px]'
                                            }`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {fields.length > 1 && (
                            <Button
                                type='button'
                                variant='destructive'
                                size='icon'
                                onClick={() => removeWarehouse(index)}
                            >
                                <Trash size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            <Button type='button' onClick={addWarehouse} className='mt-2'>
                + Добавить склад
            </Button>
        </div>
    )
}

export default Warehouses
