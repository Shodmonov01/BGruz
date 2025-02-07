// // // // import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// // // // import { Input } from '@/components/ui/input'
// // // // import { useFormContext } from 'react-hook-form'

// // // // function Warhouses({ warehouses }) {
// // // //     const { control, setValue } = useFormContext()

// // // //     return (
// // // //         <div>
// // // //             <h1 className='font-bold mb-2'>Склад клиента</h1>
// // // //             <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4'>
// // // //             {/* <h3 className='text-lg font-semibold'>Склад клиента</h3> */}
// // // //             <FormField
// // // //                 control={control}
// // // //                 name='warehouseName'
// // // //                 render={({ field }) => (
// // // //                     <FormItem>
// // // //                         {/* <FormLabel>Склад клиента</FormLabel> */}
// // // //                         <Select
// // // //                             onValueChange={value => {
// // // //                                 field.onChange(value)
// // // //                                 const selectedWarehouse = warehouses.find(w => w.name === value)
// // // //                                 setValue('warehouseAddress', selectedWarehouse?.description || '')
// // // //                             }}
// // // //                             value={field.value}
// // // //                         >
// // // //                             <FormControl>
// // // //                                 <SelectTrigger>
// // // //                                     <SelectValue placeholder='Выберите склад' />
// // // //                                 </SelectTrigger>
// // // //                             </FormControl>
// // // //                             <SelectContent>
// // // //                                 {warehouses.map(warehouse => (
// // // //                                     <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
// // // //                                         {warehouse.name}
// // // //                                     </SelectItem>
// // // //                                 ))}
// // // //                             </SelectContent>
// // // //                         </Select>
// // // //                         <FormMessage />
// // // //                     </FormItem>
// // // //                 )}
// // // //             />

// // // //             <FormField
// // // //                 control={control}
// // // //                 name='warehouseAddress'
// // // //                 render={({ field }) => (
// // // //                     <FormItem>
// // // //                         {/* <FormLabel>Адрес</FormLabel> */}
// // // //                         <FormControl>
// // // //                             <Input
// // // //                                 placeholder='Адрес'
// // // //                                 {...field}
// // // //                                 className='px-4 py-3 shadow-inner drop-shadow-xl'
// // // //                             />
// // // //                         </FormControl>
// // // //                         <FormMessage />
// // // //                     </FormItem>
// // // //                 )}
// // // //             />
// // // //         </div>
// // // //         </div>
// // // //     )
// // // // }

// // // // export default Warhouses

// // // import { useFormContext, useFieldArray } from 'react-hook-form'
// // // import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// // // import { Input } from '@/components/ui/input'
// // // import { Button } from '@/components/ui/button'
// // // import { Plus, Trash } from 'lucide-react'

// // // function Warehouses({ warehouses }) {
// // //     const { control, setValue } = useFormContext()
// // //     const { fields, append, remove } = useFieldArray({ control, name: 'warehouses' })

// // //     return (
// // //         <div>
// // //             <h1 className='font-bold mb-2'>Склады клиента</h1>
// // //             {fields.map((field, index) => (
// // //                 <div key={field.id} className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-4 border p-4 rounded-lg relative'>
// // //                     <FormField
// // //                         control={control}
// // //                         name={`warehouses.${index}.warehouseName`}
// // //                         render={({ field }) => (
// // //                             <FormItem>
// // //                                 <Select
// // //                                     onValueChange={value => {
// // //                                         field.onChange(value)
// // //                                         const selectedWarehouse = warehouses.find(w => w.name === value)
// // //                                         setValue(`warehouses.${index}.warehouseAddress`, selectedWarehouse?.description || '')
// // //                                     }}
// // //                                     value={field.value}
// // //                                 >
// // //                                     <FormControl>
// // //                                         <SelectTrigger>
// // //                                             <SelectValue placeholder='Выберите склад' />
// // //                                         </SelectTrigger>
// // //                                     </FormControl>
// // //                                     <SelectContent>
// // //                                         {warehouses.map(warehouse => (
// // //                                             <SelectItem key={warehouse.id} value={warehouse.name}>
// // //                                                 {warehouse.name}
// // //                                             </SelectItem>
// // //                                         ))}
// // //                                     </SelectContent>
// // //                                 </Select>
// // //                                 <FormMessage />
// // //                             </FormItem>
// // //                         )}
// // //                     />

// // //                     <FormField
// // //                         control={control}
// // //                         name={`warehouses.${index}.warehouseAddress`}
// // //                         render={({ field }) => (
// // //                             <FormItem>
// // //                                 <FormControl>
// // //                                     <Input
// // //                                         placeholder='Адрес'
// // //                                         {...field}
// // //                                         className='px-4 py-3 shadow-inner drop-shadow-xl'
// // //                                     />
// // //                                 </FormControl>
// // //                                 <FormMessage />
// // //                             </FormItem>
// // //                         )}
// // //                     />

// // //                     {index > 0 && (
// // //                         <button
// // //                             type='button'
// // //                             className='absolute top-2 right-2 p-1 text-red-500 hover:text-red-700'
// // //                             onClick={() => remove(index)}
// // //                         >
// // //                             <Trash size={16} />
// // //                         </button>
// // //                     )}
// // //                 </div>
// // //             ))}

// // //             <Button
// // //                 type='button'
// // //                 className='mt-4 flex items-center gap-2'
// // //                 onClick={() => append({ warehouseName: '', warehouseAddress: '' })}
// // //             >
// // //                 <Plus size={16} /> Добавить склад
// // //             </Button>
// // //         </div>
// // //     )
// // // }

// // // export default Warehouses

// // import { useState } from 'react'
// // import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// // import { Input } from '@/components/ui/input'
// // import { Button } from '@/components/ui/button'
// // import { useFormContext } from 'react-hook-form'
// // import { Trash } from 'lucide-react'

// // function Warhouses({ warehouses }) {
// //     const { control, setValue } = useFormContext()
// //     const [warehouseList, setWarehouseList] = useState([{ id: Date.now(), name: '', address: '' }])

// //     const addWarehouse = () => {
// //         setWarehouseList([...warehouseList, { id: Date.now(), name: '', address: '' }])
// //     }

// //     const removeWarehouse = index => {
// //         if (warehouseList.length > 1) {
// //             setWarehouseList(warehouseList.filter((_, i) => i !== index))
// //         }
// //     }

// //     return (
// //         <div>
// //             <h1 className='font-bold mb-2'>Склад клиента</h1>
// //             {warehouseList.map((warehouse, index) => (
// //                 <div>
// //                     <div key={warehouse.id} className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-2'>
// //                         <FormField
// //                             control={control}
// //                             name={`warehouseName-${warehouse.id}`}
// //                             render={({ field }) => (
// //                                 <FormItem>
// //                                     <Select
// //                                         onValueChange={value => {
// //                                             field.onChange(value)
// //                                             const selectedWarehouse = warehouses.find(w => w.name === value)
// //                                             setValue(
// //                                                 `warehouseAddress-${warehouse.id}`,
// //                                                 selectedWarehouse?.description || ''
// //                                             )
// //                                         }}
// //                                         value={field.value}
// //                                     >
// //                                         <FormControl>
// //                                             <SelectTrigger>
// //                                                 <SelectValue placeholder='Выберите склад' />
// //                                             </SelectTrigger>
// //                                         </FormControl>
// //                                         <SelectContent>
// //                                             {warehouses.map(warehouse => (
// //                                                 <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
// //                                                     {warehouse.name}
// //                                                 </SelectItem>
// //                                             ))}
// //                                         </SelectContent>
// //                                     </Select>
// //                                     <FormMessage />
// //                                 </FormItem>
// //                             )}
// //                         />

// //                         <div className='flex gap-4'>
// //                             <FormField
// //                                 control={control}
// //                                 name={`warehouseAddress-${warehouse.id}`}
// //                                 render={({ field }) => (
// //                                     <FormItem>
// //                                         <FormControl>
// //                                             <Input
// //                                                 placeholder='Адрес'
// //                                                 {...field}
// //                                                 className='px-4 w-[310px] py-3 shadow-inner drop-shadow-xl'
// //                                             />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             {warehouseList.length > 1 && (
// //                                 <Button
// //                                     type='button'
// //                                     variant='destructive'
// //                                     size='icon'
// //                                     onClick={() => removeWarehouse(index)}
// //                                 >
// //                                     <Trash size={16} />
// //                                 </Button>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>
// //             ))}
// //             <Button type='button' onClick={addWarehouse} className='mt-2'>
// //                 + Добавить склад
// //             </Button>
// //         </div>
// //     )
// // }

// // export default Warhouses

// import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { useFormContext, useWatch } from 'react-hook-form'
// import { Trash } from 'lucide-react'

// function Warhouses({ warehouses }) {
//     const { control, setValue } = useFormContext()
//     const warehouseList = useWatch({ control, name: 'warehouses' }) || []

//     const addWarehouse = () => {
//         setValue('warehouses', [...warehouseList, { id: Date.now(), name: '', address: '' }])
//     }

//     const removeWarehouse = index => {
//         const updatedList = warehouseList.filter((_, i) => i !== index)
//         setValue('warehouses', updatedList)
//     }

//     return (
//         <div>
//             <h1 className='font-bold mb-2'>Склад клиента</h1>
//             {warehouseList.map((warehouse, index) => (
//                 <div key={warehouse.id} className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-2'>
//                     <FormField
//                         control={control}
//                         name={`warehouses.${index}.name`}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <Select
//                                     onValueChange={value => {
//                                         field.onChange(value)
//                                         const selectedWarehouse = warehouses.find(w => w.id.toString() === value)
//                                         if (selectedWarehouse) {
//                                             setValue(`warehouses.${index}.address`, selectedWarehouse.description || '')
//                                         }
//                                     }}
//                                     value={field.value}
//                                 >
//                                     <FormControl>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder='Выберите склад' />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         {warehouses.map(warehouse => (
//                                             <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
//                                                 {warehouse.name}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <div className='flex gap-4'>
//                         <FormField
//                             control={control}
//                             name={`warehouses.${index}.address`}
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input
//                                             placeholder='Адрес'
//                                             {...field}
//                                             className='px-4 w-[310px] py-3 shadow-inner drop-shadow-xl'
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         {warehouseList.length > 1 && (
//                             <Button
//                                 type='button'
//                                 variant='destructive'
//                                 size='icon'
//                                 onClick={() => removeWarehouse(index)}
//                             >
//                                 <Trash size={16} />
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             ))}
//             <Button type='button' onClick={addWarehouse} className='mt-2'>
//                 + Добавить склад
//             </Button>
//         </div>
//     )
// }

// export default Warhouses

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Trash } from 'lucide-react'

function Warehouses({ warehouses }) {
    const { control, setValue, getValues } = useFormContext()
    const warehouseList = useWatch({ control, name: 'warehouses' }) || []

    useEffect(() => {
        // Если массив складов пустой, добавляем один склад по умолчанию
        if (warehouseList.length === 0) {
            setValue('warehouses', [{ id: Date.now(), name: '', address: '' }])
        }
    }, [warehouseList, setValue])

    const addWarehouse = () => {
        setValue('warehouses', [...getValues('warehouses'), { id: Date.now(), name: '', address: '' }])
    }

    const removeWarehouse = index => {
        const updatedList = getValues('warehouses').filter((_, i) => i !== index)
        setValue('warehouses', updatedList)
    }

    return (
        <div>
            <h1 className='font-bold mb-2'>Склад клиента</h1>
            {warehouseList.map((warehouse, index) => (
                <div key={warehouse.id} className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-2'>
                    <FormField
                        control={control}
                        name={`warehouses.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                {/* <Select
                                    onValueChange={value => {
                                        field.onChange(value)
                                        const selectedWarehouse = warehouses.find(w => w.id.toString() === value)
                                        if (selectedWarehouse) {
                                            setValue(`warehouses.${index}.address`, selectedWarehouse.description || '')
                                        }
                                    }}
                                    value={field.value}
                                > */}
                                <Select
    onValueChange={value => {
        const selectedWarehouse = warehouses.find(w => w.id.toString() === value)
        if (selectedWarehouse) {
            setValue(`warehouses.${index}.cityId`, selectedWarehouse.id) // Числовой ID склада
            setValue(`warehouses.${index}.cityName`, selectedWarehouse.name) // Название склада
            setValue(`warehouses.${index}.address`, `${selectedWarehouse.name}, Склад 1`) // Адрес
        }
    }}
    value={field.value ? field.value.toString() : ''} // Приводим к строке для Select
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
                        {warehouseList.length > 1 && (
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
