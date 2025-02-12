import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { useEffect } from 'react'

function Warehouses({ warehouses }) {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'warehouses',
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '', address: '' })
    }
  }, [])

  const addWarehouse = () => append({ name: '', address: '' })
  const removeWarehouse = (index) => remove(index)

  return (
    <div>
      <h1 className='font-bold mb-2'>Склад клиента</h1>
      {fields.map((field, index) => (
        <div key={field.id} className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-2'>
          <FormField
            control={control}
            name={`warehouses.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Выберите склад' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
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

          <div className='flex gap-4'>
            <FormField
              control={control}
              name={`warehouses.${index}.address`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Адрес'
                      {...field}
                      className='px-4 w-[310px] py-3 shadow-inner drop-shadow-xl'
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
