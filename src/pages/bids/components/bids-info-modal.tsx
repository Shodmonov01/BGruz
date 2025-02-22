import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { postData2, fetchPrivateData } from '@/api/api'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Terminal, UserContext, VehicleProfile, Warehouse } from '@/types'
import BidHeader from './bid-info-modal-details/BidHeader'
import BidDetails from './bid-info-modal-details/BidDetails'
import BidRoute from './bid-info-modal-details/BidRoute'
import BidFinance from './bid-info-modal-details/BidFinance'

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
    const [originalData, setOriginalData] = useState({ ...selectedBid }) 

    useEffect(() => {
        setFormData({ ...selectedBid })
        setOriginalData({ ...selectedBid }) 
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

            if (name === 'terminal1' || name === 'terminal2') {
                const selectedTerminal = terminals.find(t => t.id.toString() === value)
                if (selectedTerminal) {
                    return {
                        ...prev,
                        [name]: {
                            cityId: selectedTerminal.id,
                            cityName: selectedTerminal.name,
                            address: selectedTerminal.description || ''
                        }
                    }
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
        // console.log(data)
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
                        <BidHeader formData={formData} />
                        <BidDetails
                            formData={formData}
                            handleChange={handleChange}
                            isReadOnly={isReadOnly}
                            clients={clients}
                            handleClientChange={handleClientChange}
                            isFetched={isFetched}
                            vehicleProfiles={vehicleProfiles}
                        />
                        <BidRoute
                            formData={formData}
                            handleChange={handleChange}
                            isReadOnly={isReadOnly}
                            terminals={terminals}
                            warehouses={warehouses}
                        />
                        <BidFinance
                            formData={formData}
                            handleChange={handleChange}
                            isReadOnly={isReadOnly}
                            extraServices={extraServices}
                        />
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
