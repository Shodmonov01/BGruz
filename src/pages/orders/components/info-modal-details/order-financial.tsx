import type React from 'react'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { postData2 } from '@/api/api'

interface OrderFinancialProps {
    formData: any
    formatNumber: (value: string) => string
    setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function OrderFinancial({ formData, formatNumber, setFormData }: OrderFinancialProps) {
    //@ts-ignore
    const [loading, setLoading] = useState(false)

    const handleExtraServiceChange = async (service, index, newCount) => {
        try {
            setLoading(true)

            const newExtraServices = [...formData.extraServices]
            newExtraServices[index] = {
                ...service,
                count: newCount
            }
            setFormData(prev => ({
                ...prev,
                extraServices: newExtraServices
            }))

            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                return
            }

            const payload = {
                id: service.id,
                vehicleProfileId: formData.assignedVehicle.vehicleProfileId,
                count: newCount
            }

            const response = await postData2(`api/v1/orders/${formData.id}/extra_services`, payload, token)
            console.log('response', response)
        } catch (error) {
            console.error('Error updating extra service:', error)
            const newExtraServices = [...formData.extraServices]
            newExtraServices[index] = service
            setFormData(prev => ({
                ...prev,
                extraServices: newExtraServices
            }))
        } finally {
            setLoading(false)
        }
    }

    const handleCargoCostChange = async newPrice => {
        try {
            setLoading(true)

            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                return
            }

            const response = await fetch(
                `https://portal.bgruz.com/api/v1/orders/${formData.id}/cargo_cost?cost=${newPrice}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to update cargo cost')
            }
        } catch (error) {
            console.error('Error updating cargo cost:', error)
        } finally {
            setLoading(false)
        }
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
                        <div className='grid grid-cols-3 gap-4'>
                            <div>
                                <p className='text-[20px] font-bold mb-3'>Перевозка</p>
                            </div>
                            <div>
                                <p className='text-[20px] font-bold mb-3'>Цена с НДС</p>
                                <Input
                                    className='text-right'
                                    value={formatNumber(String(formData.priceNds.toFixed(2)))}
                                    placeholder='Цена с НДС'
                                />
                            </div>
                            <div>
                                <p className='text-[20px] font-bold mb-3'>Цена без НДС</p>
                                <Input
                                    className='text-right'
                                    value={formatNumber(String(formData.price.toFixed(2)))}
                                    placeholder='Цена без НДС'
                                />
                            </div>
                        </div>
                        <div>
                            <p className='text-[20px] font-bold mb-3'>Доп услуги</p>
                            <div className='flex flex-col gap-3'>
                                {formData.extraServices.map((service, index) => (
                                    <div key={index} className='space-y-2'>
                                        <div className='flex items-center gap-2'>
                                            <Checkbox
                                                className='font-bold'
                                                id={`service-${index}`}
                                                checked={service.count > 0}
                                                onCheckedChange={checked => {
                                                    handleExtraServiceChange(service, index, checked ? 1 : 0)
                                                }}
                                            />
                                            <label className='min-w-[240px] font-bold' htmlFor={`service-${index}`}>
                                                {service.name}
                                            </label>
                                            <Input
                                                type='number'
                                                className='w-20'
                                                value={formatNumber(String(service.count))}
                                                onChange={e => {
                                                    handleExtraServiceChange(
                                                        service,
                                                        index,
                                                        Number.parseInt(e.target.value) || 0
                                                    )
                                                }}
                                            />
                                            <Input
                                                className='text-right'
                                                value={formatNumber(String(service.priceNds.toFixed(2)))}
                                                readOnly
                                            />
                                            <Input
                                                className='text-right'
                                                value={formatNumber(String(service.price.toFixed(2)))}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className='w-full flex justify-end'>
                                    <button className='bg-tertiary text-white py-1 px-4 rounded-sm'>Сохранить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='space-y-2 px-10'>
                <div className='flex items-center gap-2'>
                    <p className='font-bold w-full min-w-[350px] text-[20px]'>Полная стоимость рейса без НДС</p>
                    <Input
                        className='text-right'
                        value={formatNumber(String(formData.fullPriceNds.toFixed(2)))}
                        placeholder='Полная стоимость с НДС'
                    />
                    <Input
                        className='text-right'
                        value={formatNumber(String(formData.fullPrice.toFixed(2)))}
                        placeholder='Полная стоимость без НДС'
                    />
                </div>
            </div>
            <div className='px-10'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className='font-bold text-[20px]'>Груз</p>
                        <Input
                            className='mt-1'
                            placeholder='Название груза'
                            value={formData.buyBid.cargoTitle || ''}
                            readOnly
                        />
                    </div>
                    <div>
                        <p className='font-bold text-[20px]'>Стоимость груза</p>
                        <Input
                            className='mt-1 text-right'
                            name='price'
                            value={formData.cargoCost ? formatNumber(String(formData.cargoCost)) : '-'}
                            onChange={e => handleCargoCostChange(Number.parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className='w-full flex justify-end mt-3'>
                    <button className='bg-tertiary text-white py-1 px-4 rounded-sm'>Сохранить</button>
                </div>
            </div>
        </>
    )
}
