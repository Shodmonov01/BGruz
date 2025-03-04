import type React from 'react'
import { DialogHeader } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

const statusTranslations = {
    new: 'Новый',
    canceledByCarrierWithPenalty: 'Отменяется перевозчиком (половина ГО)',
    canceledByCustomerWithPenalty: 'Отменяется заказчиком (половина ГО)',
    canceledByCarrier: 'Отменяется перевозчиком',
    canceledByCustomer: 'Отменяется заказчиком',
    failed: 'Сорван',
    failing: 'Срывается',
    completed: 'Выполнен',
    inTransit: 'Машина в пути',
    canceled: 'Отменен',
    headingToLoading: 'Еду на погрузку',
    loading: 'На погрузке',
    unloading: 'На выгрузке',
    delivered: 'Груз сдан'
}

interface OrderHeaderProps {
    formData: any
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setFormData: any
}

export function OrderHeader({ formData, handleChange, setFormData }: OrderHeaderProps) {
    return (
        <>
            <DialogHeader>
                <div>
                    <div className='mb-6 mt-3 px-6'>
                        <span className='rounded bg-orange-500 px-4 py-2 text-sm text-white mt-3'>
                            {statusTranslations[formData.status] || formData.status || '—'}
                        </span>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex items-center gap-4 w-full justify-center'>
                            <span className='text-[#03B4E0] w-[33%] flex justify-center text-[22px] font-semibold'>
                                CM ID {formData.buyBid.persistentId}
                            </span>
                            <span className='text-[40px] w-[33%] text-[#EE6F2D] flex justify-center border-x-2 px-14 border-[#EE6F2D] font-bold'>
                                Заказ
                            </span>
                            <span className='text-[#03B4E0] text-[22px] flex font-semibold justify-center mx-auto w-[33%]'>
                                ID {formData.id} от {new Date(formData.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogHeader>

            <div className='bg-cyan-500 flex py-2 px-6 text-white'>
                <div>
                    <p className='font-bold text-[20px]'>Статус заказа</p>
                </div>
            </div>

            <div className='grid gap-6'>
                <div className='flex justify-between px-10'>
                    <div className='flex justify-between items-center gap-4'>
                        <p className='font-bold'>Статус заказа:</p>
                        <input
                            type='text'
                            name='status'
                            value={statusTranslations[formData.status] || formData.status || '—'}
                            onChange={handleChange}
                            className='border border-gray-300 rounded px-2 py-1'
                        />
                    </div>
                    <div className='flex justify-between items-center gap-4'>
                        <p className='font-bold'>Изменено</p>
                        <p>{new Date(formData.statusUpdated).toLocaleString('ru-RU')}</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between items-center px-10'>
                <div className='flex justify-between items-center gap-4'>
                    <p className='font-bold'>Документы сданы:</p>
                    <p className='flex items-center gap-2'>
                        <Checkbox
                            checked={!!formData.docSubmissionDate}
                            onChange={e => {
                                setFormData(prev => ({
                                    ...prev,
                                    //@ts-ignore
                                    docSubmissionDate: e.target.checked ? new Date().toISOString() : null
                                }))
                            }}
                        />
                        {formData.docSubmissionDate
                            ? new Date(formData.docSubmissionDate).toLocaleString('ru-RU')
                            : 'Не сданы'}
                    </p>
                </div>
                <div className='flex justify-between items-center gap-4 relative -left-14'>
                    <p className='font-bold'>Изменено</p>
                    <p>{formData.docSubmissionUserId ? 'ID: ' + formData.docSubmissionUserId : 'Не изменено'}</p>
                </div>
            </div>
        </>
    )
}
