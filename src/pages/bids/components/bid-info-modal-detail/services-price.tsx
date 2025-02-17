import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Checkbox } from '@/components/ui/checkbox'

function ServicesPrice({ formData, handleChange, isReadOnly }) {
    return (
        <div>
            {' '}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Checkbox
                            id='priceRequest'
                            checked={formData.isPriceRequest}
                            onCheckedChange={checked => handleChange('isPriceRequest', checked)}
                        />
                        <Label htmlFor='priceRequest' className='font-medium'>
                            Запрос цены
                        </Label>
                    </div>

                    <div className='flex items-center'>
                        <Label className='font-medium min-w-28'>Цена перевозки</Label>
                        <Input
                            type='text'
                            className='w-full'
                            name='price'
                            value={formData.price || ''}
                            onChange={e => handleChange('price', e.target.value)}
                            readOnly={isReadOnly}
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label className='font-medium'>Доп услуги</Label>
                    <div className='space-y-2'>
                        {formData.extraServices?.map((service, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <Checkbox id={`service${index}`} checked={true} />
                                <Label htmlFor={`service${index}`}>{service.name}</Label>
                                <div className='flex items-center gap-2 ml-auto'>
                                    <Input
                                        type='number'
                                        className='w-20'
                                        value={service.count}
                                        onChange={e =>
                                            handleChange(`extraServices[${index}].count`, Number(e.target.value))
                                        }
                                        readOnly={isReadOnly}
                                    />
                                    <Input
                                        type='text'
                                        value={service.price}
                                        onChange={e => handleChange(`extraServices[${index}].price`, e.target.value)}
                                        className='w-32'
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-center'>
                    <Label className='font-medium w-full'>Полная стоимость рейса без НДС</Label>
                    <Input
                        type='text'
                        className='mt-1'
                        value={formData.fullPrice || ''}
                        onChange={e => handleChange('fullPrice', e.target.value)}
                        readOnly={isReadOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default ServicesPrice
