import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { postData2, fetchPrivateData } from '@/api/api'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Terminal, UserContext, VehicleProfile, Warehouse } from '@/types'
import Transportation from './bid-info-modal-detail/transportation'
import Lines from './bid-info-modal-detail/lines'
import Comments from './bid-info-modal-detail/comments'
import ServicesPrice from './bid-info-modal-detail/services-price'

function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const [formData, setFormData] = useState({ ...selectedBid })
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
    const [clients, setClients] = useState<UserContext[]>([])
    const [terminals, setTerminals] = useState<Terminal[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<VehicleProfile[]>([])

    const [extraServices, setExtraServices] = useState([])
    const [data, setData] = useState()
    const [isFetched, setIsFetched] = useState(true)
    const [originalData, setOriginalData] = useState({ ...selectedBid }) // Сохраняем оригинальные данные

    console.log(selectedBid)

    useEffect(() => {
        setFormData({ ...selectedBid })
        setOriginalData({ ...selectedBid }) // Обновляем оригинальные данные при открытии модалки
    }, [selectedBid])

    useEffect(() => {
        const loadClients = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const data = await fetchPrivateData('api/v1/organization/clients', token)
                setClients(data)
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error)
            }
        }
        loadClients()
    }, [])
    const handleChange = (name, value) => {
        setFormData(prev => {
            if (name.includes('extraServices')) {
                const [_, index, field] = name.match(/extraServices\[(\d+)\]\.(.+)/)
                const newExtraServices = [...prev.extraServices]
                newExtraServices[index] = {
                    ...newExtraServices[index],
                    [field]: value
                }
                return {
                    ...prev,
                    extraServices: newExtraServices
                }
            }
            return { ...prev, [name]: value }
        })
    }

    const handleClientChange = async (clientId: string) => {
        handleChange('client', clientId)
        try {
            const token = localStorage.getItem('authToken')
            const data = await fetchPrivateData(`api/v1/organization/?organization_id=${clientId}`, token)
            setData(data)

            setTerminals(data.terminals || [])
            setWarehouses(data.warehouses || [])
            setVehicleProfiles(data.vehicleProfiles || [])
            setExtraServices(data.extraServices || [])
        } catch (error) {
            console.error('Ошибка при загрузке данных организации:', error)
        }
    }

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')

        // Отфильтровываем только измененные данные
        const updatedFields = Object.keys(formData).reduce((acc, key) => {
            if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
                acc[key] = formData[key]
            }
            return acc
        }, {})

        if (Object.keys(updatedFields).length === 0) {
            alert('Нет изменений для сохранения.')
            return
        }

        try {
            await postData2(`api/v1/bids/${formData._id}`, updatedFields, token)
            alert('Заявка успешно обновлена!')
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
        }
    }

    const handleEdit = () => {
        handleClientChange(formData.client?.organizationId)
        setIsFetched(false)
        console.log(data)
    }

    useEffect(() => {
        if (data) {
            setIsReadOnly(false)
        }
    }, [data])
    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTitle></DialogTitle>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
                <div className='relative bg-white rounded-lg'>
                    <div className='p-6 space-y-6'>
                        <div className='text-center'>
                            <h2 className='text-2xl font-bold text-tertiary'>Заявка СМ ID {formData.persistentId}</h2>
                            <p className='text-sm '>
                                Дата {format(new Date(formData.loadingDate || new Date()), 'dd.MM.yyyy')} №
                                {formData.number}
                            </p>
                        </div>

                        <Transportation
                            formData={formData}
                            handleChange={handleChange}
                            clients={clients}
                            vehicleProfiles={vehicleProfiles}
                            isReadOnly={isReadOnly}
                            handleClientChange={handleClientChange}
                            isFetched={isFetched}
                        />
                        <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center text-xl font-medium'>
                            Маршрут
                        </div>

                        <Lines
                            handleChange={handleChange}
                            formData={formData}
                            isReadOnly={isReadOnly}
                            terminals={terminals}
                            warehouses={warehouses}
                        />

                        <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center'>
                            <div className='text-xl font-medium'>Финансы</div>
                            <div className='text-sm'>Все цены указаны без НДС</div>
                        </div>

                        <ServicesPrice handleChange={handleChange} formData={formData} isReadOnly={isReadOnly} />

                        <Comments handleChange={handleChange} formData={formData} isReadOnly={isReadOnly} />

                        <div className='flex justify-center gap-4 py-6'>
                            <Button
                                disabled={isReadOnly}
                                onClick={handleSave}
                                className='bg-orange-500 hover:bg-orange-600 text-white'
                            >
                                Сохранить изменения
                            </Button>
                            <Button disabled={isReadOnly} className='bg-orange-500 hover:bg-orange-600 text-white'>
                                Сохранить заявку как новую
                            </Button>
                            <Button onClick={handleEdit} className='bg-orange-500 hover:bg-orange-600 text-white'>
                                Редактировать
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BidsInfoModal
