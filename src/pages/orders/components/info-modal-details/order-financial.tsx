import type React from 'react'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { postData, postData2 } from '@/api/api'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'

interface OrderFinancialProps {
    formData: any
    formatNumber: (value: string) => string
    setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function OrderFinancial({ formData, formatNumber, setFormData }: OrderFinancialProps) {
    const [loading, setLoading] = useState(false)

    // const handleExtraServiceChange = async (service, index, newCount) => {
    //     try {
    //         setLoading(true)

    //         const newExtraServices = [...formData.extraServices]
    //         newExtraServices[index] = {
    //             ...service,
    //             count: newCount
    //         }
    //         setFormData(prev => ({
    //             ...prev,
    //             extraServices: newExtraServices
    //         }))

    //         const token = localStorage.getItem('authToken')
    //         if (!token) {
    //             console.error('Не найден токен авторизации')
    //             return
    //         }

    //         const payload = [
    //             {
    //                 id: service.id,
    //                 vehicleProfileId: formData.assignedVehicle.vehicleProfileId,
    //                 count: newCount
    //             }
    //         ]

    //         const response = await postData2(`api/v1/orders/${formData.id}/extra_services`, payload, token)
    //         console.log('response', response)
    //     } catch (error) {
    //         console.error('Error updating extra service:', error)
    //         const newExtraServices = [...formData.extraServices]
    //         newExtraServices[index] = service
    //         setFormData(prev => ({
    //             ...prev,
    //             extraServices: newExtraServices
    //         }))
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleSaveExtraServices = async () => {
        try {
            setLoading(true)

            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                return
            }

            // Формируем payload из всех услуг
            const payload = formData.extraServices.map(service => ({
                id: service.id,
                vehicleProfileId: formData.assignedVehicle.vehicleProfileId,
                count: service.count
            }))

            // Отправляем все данные разом
            const response = await postData2(`api/v1/orders/${formData.id}/extra_services`, payload, token)
            console.log('response', response)
        } catch (error) {
            console.error('Ошибка при сохранении доп. услуг:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCargoCostChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            buyBid: {
                ...prev.buyBid,
                cargoCost: value // Обновляем локальное состояние
            }
        }))
    }

    const handleSaveCargoCost = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                console.error('Не найден токен авторизации');
                return;
            }
    
            const endpoint = `api/v1/orders/${formData.id}/cargo_cost`;
            const data = { cost: formData.buyBid.cargoCost };
    
            await postData(endpoint, data, token);
            
            console.log('Стоимость груза успешно обновлена');
        } catch (error) {
            console.error('Ошибка при обновлении стоимости груза:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleCountChange = (index: number, value: number) => {
        setFormData(prev => ({
            ...prev,
            extraServices: prev.extraServices.map((service, i) =>
                i === index ? { ...service, count: value } : service
            )
        }))
    }

    return (
        <>
            <div className='bg-cyan-500 flex flex-col py-2 px-6 text-white justify-center'>
                <p className='text-[20px] font-bold'>Финансы</p>
                <p>Все цены указаны без НДС</p>
            </div>

            <div className='shadow-none border-0 px-10'>
                <div className='grid gap-4 pt-6'>
                    <div className='grid gap-4'>
                        <div className='grid grid-cols-2'>
                            <div>
                                <p className='text-[20px] font-bold mb-3'>Перевозка</p>
                            </div>

                            <div>
                                <Input
                                    className='text-right'
                                    value={formatNumber(String(formData.price.toFixed(2)))}
                                    placeholder='Цена без НДС'
                                    // @ts-expect-error надо настроить
                                    onChange={e => handleCargoCostChange(Number.parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='space-y-2 px-10'>
                <div className='space-y-2'>
                    <p className='text-[20px] font-bold mb-3'>Доп услуги</p>

                    {formData.extraServices.map((service, index) => (
                        <div className='grid grid-cols-2'>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    className='font-bold'
                                    id={`service-${index}`}
                                    checked={service.count > 0}
                                    onCheckedChange={checked => {
                                        setFormData(prev => ({
                                            ...prev,
                                            extraServices: prev.extraServices.map((s, i) =>
                                                i === index ? { ...s, count: checked ? 1 : 0 } : s
                                            )
                                        }))
                                    }}
                                />

                                <label className='min-w-[240px] font-bold' htmlFor={`service-${index}`}>
                                    {service.name}
                                </label>
                            </div>
                            <div className='flex gap-2'>
                                <div
                                    className={`flex items-center border rounded-lg overflow-hidden w-24 h-[51px] ml-0 md:ml-0 mt-0 ${service.count === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className='flex-1 flex items-center justify-center text-xl font-semibold'>
                                        {service.count}
                                    </div>
                                    <div className='flex flex-col border-l'>
                                        <button
                                            type='button'
                                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                            onClick={() => handleCountChange(index, service.count + 1)}
                                            disabled={service.count === 0}
                                        >
                                            <Plus size={14} className='text-green-500' />
                                        </button>
                                        <button
                                            type='button'
                                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                            onClick={() => handleCountChange(index, Math.max(1, service.count - 1))}
                                            disabled={service.count <= 1}
                                        >
                                            <Minus size={14} className='text-yellow-500' />
                                        </button>
                                    </div>
                                </div>
                                <Input
                                    className='text-right'
                                    value={formatNumber(String((service.price * service.count).toFixed(2)))}
                                    readOnly
                                />
                            </div>
                        </div>
                    ))}
                    {/* <p className='font-bold w-full min-w-[350px] text-[20px]'>Полная стоимость рейса без НДС</p> */}
                    <div className='w-full flex justify-end'>
                        {/* <button className='bg-tertiary text-white py-1 px-4 rounded-sm'>Сохранить</button> */}
                        <Button
                            variant='tertiary'
                            className='!py-4'
                            onClick={handleSaveExtraServices}
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <p className='font-bold w-full min-w-[350px] text-[20px]'>Полная стоимость рейса без НДС</p>
                    <Input
                        className='text-right'
                        value={formatNumber(String(formData.fullPrice.toFixed(2)))}
                        placeholder='Полная стоимость с НДС'
                    />
                </div>

                <div className='flex items-center gap-2'>
                    <p className='font-bold w-full min-w-[350px] text-[20px]'>Комиссия без НДС</p>
                    <Input
                        className='text-right'
                        value={formatNumber(String(formData.commission.toFixed(2)))}
                        placeholder='Полная стоимость с НДС'
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <p className='font-bold w-full min-w-[350px] text-[20px]'>К оплате НДС</p>
                    <Input
                        className='text-right'
                        value={formatNumber(String(formData.fullPriceNds.toFixed(2)))}
                        placeholder='Полная стоимость с НДС'
                    />
                </div>
            </div>

            <div className='px-10 space-y-3'>
                <div>
                    <p className='font-bold text-[20px]'>Груз</p>
                    <Input
                        className='mt-1'
                        placeholder='Название груза'
                        value={formData.buyBid.cargoTitle || ''}
                        readOnly
                    />
                </div>
                <div className='grid gap-2 grid-cols-2 items-center'>
                    <Label className='font-bold text-[20px]'>Стоимость груза</Label>
                    <Input
                        className='mt-1'
                        placeholder='Стоимость груза'
                        value={formatNumber(String(formData.buyBid.cargoCost || ''))}
                        onChange={e => handleCargoCostChange(e.target.value)}
                    />
                </div>
                <div className='w-full flex gap-2 items-center justify-end'>
                    <Button variant='tertiary' className='!py-4' onClick={handleSaveCargoCost} disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </div>

               
                <div className='grid gap-2'>
                    <Label className='font-bold text-[20px]'>Комментарии</Label>
                    <Textarea
                        readOnly
                        className='h-[148px]'
                        placeholder='Комментарии к грузу'
                        value={formData.buyBid.description || ''}
                    />
                </div>
            </div>
        </>
    )
}
