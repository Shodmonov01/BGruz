import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function BidFinance({ formData, handleChange, isReadOnly, extraServices }) {
    return (
        <>
            <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center'>
                <div className='text-[20px] font-bold '>Финансы</div>
                <div className='text-sm'>Все цены указаны без НДС</div>
            </div>

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Checkbox
                            disabled={isReadOnly}
                            id='priceRequest'
                            checked={formData.isPriceRequest}
                            onCheckedChange={checked => handleChange('isPriceRequest', checked)}
                        />
                        <Label htmlFor='priceRequest' className='text-[18px] font-bold text-[#1E293B]'>
                            Запрос цены
                        </Label>
                    </div>

                    <div className='flex items-center'>
                        <Label className='text-[18px] font-bold text-[#1E293B] min-w-40'>Цена перевозки</Label>
                        <Input
                            type='number'
                            className='w-full'
                            name='price'
                            value={formData.price || ''}
                            onChange={e => handleChange('price', e.target.value)}
                            disabled={isReadOnly || formData.isPriceRequest}
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <div className='mb-6'>
                        <Label className='text-[18px] font-bold text-[#1E293B]'>Доп услуги</Label>
                    </div>
                    <div className='space-y-2'>
                        {formData.extraServices?.map((service, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <Checkbox
                                    disabled={isReadOnly}
                                    id={`service${index}`}
                                    checked={service.count > 0}
                                    onCheckedChange={checked => {
                                        handleChange(`extraServices[${index}].count`, checked ? 1 : 0)
                                    }}
                                />
                                <Label className='text-[18px] font-bold text-[#1E293B]' htmlFor={`service${index}`}>
                                    {service.name}
                                </Label>
                                <div className='flex items-center gap-2 ml-auto'>
                                    <Input
                                        type='number'
                                        className='w-20'
                                        value={service.count}
                                        onChange={e => {
                                            const newValue = Number(e.target.value)
                                            if (newValue >= 0) {
                                                handleChange(`extraServices[${index}].count`, newValue)
                                            }
                                        }}
                                        disabled={isReadOnly}
                                    />
                                    <Input
                                        disabled={isReadOnly}
                                        type='number'
                                        value={service.count * service.price}
                                        onChange={e => handleChange(`extraServices[${index}].price`, e.target.value)}
                                        className='w-[185px]'
                                        readOnly={isReadOnly}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex items-center'>
                    <Label className='text-[18px] font-bold text-[#1E293B] w-full min-w-[420px]'>
                        Полная стоимость рейса без НДС
                    </Label>
                    <Input
                        type='text'
                        className='mt-1'
                        value={formData.fullPrice || ''}
                        onChange={e => handleChange('fullPrice', e.target.value)}
                        disabled
                    />
                </div>
            </div>

            <div className='space-y-4'>
                <div>
                    <Label className='text-[18px] font-bold text-[#1E293B]'>Груз</Label>
                    <Input
                        className='mt-1'
                        placeholder='Название груза'
                        value={formData.cargoTitle || ''}
                        onChange={e => handleChange('cargoTitle', e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>
                <div>
                    <Label className='text-[18px] font-bold text-[#1E293B]'>Комментарии</Label>
                    <Textarea
                        placeholder='Комментарии к грузу'
                        className='mt-1 min-h-[100px]'
                        value={formData.description || ''}
                        onChange={e => handleChange('description', e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>
            </div>
        </>
    )
}

export default BidFinance
