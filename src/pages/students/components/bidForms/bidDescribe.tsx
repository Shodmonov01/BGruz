// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
// import { Checkbox } from '@radix-ui/react-checkbox'
// import { Input } from '@/components/ui/input'

// function BidDescribe({ extraServices }) {
//     return (
//         <div>
//             {' '}
//             <div className='space-y-4'>
//                 {/* <h3 className='text-lg font-semibold'>Доп Услуги</h3> */}
//                 <FormField
//                     control={control}
//                     name='warehouseName'
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Доп услуги</FormLabel>
//                             <Select
//                                 onValueChange={value => {
//                                     field.onChange(value)
//                                     const selectedExtraServices = extraServices.find(w => w.name === value)
//                                     form.setValue('warehouseAddress', selectedExtraServices?.description || '')
//                                 }}
//                                 value={field.value}
//                             >
//                                 <FormControl>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder='Выберите доп услугу' />
//                                     </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                     {extraServices.map(extraServices => (
//                                         <SelectItem key={extraServices.id} value={extraServices.id.toString()}>
//                                             {extraServices.name}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//             </div>
//             <FormField
//                 control={form.control}
//                 name='price'
//                 render={({ field }) => (
//                     <FormItem>
//                         <FormLabel>Цена</FormLabel>
//                         <FormControl>
//                             <Input
//                                 type='number'
//                                 placeholder='Цена'
//                                 {...field}
//                                 className='px-4 py-6 shadow-inner drop-shadow-xl'
//                                 value={field.value || ''} // Убедимся, что значение не undefined
//                                 onChange={e => field.onChange(e.target.valueAsNumber)}
//                             />
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />
//             <FormField
//                 control={form.control}
//                 name='description'
//                 render={({ field }) => (
//                     <FormItem>
//                         <FormLabel>Описание</FormLabel>
//                         <FormControl>
//                             <Input
//                                 placeholder='Описание'
//                                 {...field}
//                                 className='px-4 py-6 shadow-inner drop-shadow-xl'
//                             />
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />
//             <FormField
//                 control={form.control}
//                 name='requestPrice'
//                 render={({ field }) => (
//                     <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
//                         <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                         </FormControl>
//                         <div className='space-y-1 leading-none'>
//                             <FormLabel>Запрос цены</FormLabel>
//                         </div>
//                     </FormItem>
//                 )}
//             />
//         </div>
//     )
// }

// export default BidDescribe

import { useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@radix-ui/react-checkbox'
import { Input } from '@/components/ui/input'

function BidDescribe({ extraServices }) {
    const { control, setValue } = useFormContext()

    return (
        <div className='space-y-4'>
            {/* Доп Услуги */}
            <FormField
                control={control}
                name='warehouseName'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Доп услуги</FormLabel>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                const selectedExtraService = extraServices.find(
                                    service => service.id.toString() === value
                                )
                                setValue('warehouseAddress', selectedExtraService?.description || '')
                            }}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder='Выберите доп услугу' />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {extraServices.map((service, index) => (
                                    <SelectItem key={`${service.id}-${index}`} value={service.id.toString()}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Цена */}
            <FormField
                control={control}
                name='price'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Цена</FormLabel>
                        <FormControl>
                            <Input
                                type='number'
                                placeholder='Цена'
                                {...field}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.valueAsNumber)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Описание */}
            <FormField
                control={control}
                name='description'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Описание</FormLabel>
                        <FormControl>
                            <Input
                                placeholder='Описание'
                                {...field}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Запрос цены */}
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
        </div>
    )
}

export default BidDescribe
