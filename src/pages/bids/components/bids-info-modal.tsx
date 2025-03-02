// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { postData2, fetchPrivateData } from '@/api/api'
// import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
// import { Terminal, UserContext, VehicleProfile, Warehouse } from '@/types'
// import BidHeader from './bid-info-modal-details/BidHeader'
// import BidDetails from './bid-info-modal-details/BidDetails'
// import BidRoute from './bid-info-modal-details/BidRoute'
// import BidFinance from './bid-info-modal-details/BidFinance'

// interface OrganizationData {
//     terminals: { id: number; name: string; description: string }[];
//     warehouses: { id: number; name: string; description: string }[];
//     // vehicleProfiles: { id: number; name: string }[];
//     vehicleProfiles: Pick<VehicleProfile, "id" | "name">[];
//     extraServices: { id: number; name: string; description: string }[];
// }

// function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
//     const [formData, setFormData] = useState({ ...selectedBid })
//     const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
//     const [clients, setClients] = useState<UserContext[]>([])
//     const [terminals, setTerminals] = useState<Terminal[]>([])
//     const [warehouses, setWarehouses] = useState<Warehouse[]>([])
//     // const [vehicleProfiles, setVehicleProfiles] = useState<VehicleProfile[]>([])
//     // const [extraServices, setExtraServices] = useState([])
//     const [vehicleProfiles, setVehicleProfiles] = useState<VehicleProfile[]>([])
//     const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])

//     // const [data, setData] = useState()
//     const [data, setData] = useState<OrganizationData | undefined>(undefined);
//     const [isFetched, setIsFetched] = useState(true)
//     const [originalData, setOriginalData] = useState({ ...selectedBid })

//     useEffect(() => {
//         setFormData({ ...selectedBid })
//         setOriginalData({ ...selectedBid })
//     }, [selectedBid])

//     useEffect(() => {
//         const loadClients = async () => {
//             try {
//                 const token = localStorage.getItem('authToken') || ''
//                 const data = await fetchPrivateData<UserContext[]>('api/v1/organization/clients', token)
//                 setClients(data)
//             } catch (error) {
//                 console.error('Ошибка при загрузке клиентов:', error)
//             }
//         }
//         loadClients()
//     }, [])

//     const handleChange = (name, value) => {
//         setFormData(prev => {
//             if (name.includes('extraServices')) {
//                 const [_, index, field] = name.match(/extraServices\[(\d+)\]\.(.+)/)
//                 const newExtraServices = [...prev.extraServices]
//                 newExtraServices[index] = {
//                     ...newExtraServices[index],
//                     [field]: value
//                 }
//                 return {
//                     ...prev,
//                     extraServices: newExtraServices
//                 }
//             }

//             if (name === 'terminal1' || name === 'terminal2') {
//                 const selectedTerminal = terminals.find(t => t.id.toString() === value)
//                 if (selectedTerminal) {
//                     return {
//                         ...prev,
//                         [name]: {
//                             cityId: selectedTerminal.id,
//                             cityName: selectedTerminal.name,
//                             address: selectedTerminal.description || ''
//                         }
//                     }
//                 }
//             }

//             return { ...prev, [name]: value }
//         })
//     }
//     const handleClientChange = async (clientId: string) => {
//         handleChange('client', clientId)
//         try {
//             const token = localStorage.getItem('authToken') || ''
//             const data = await fetchPrivateData<OrganizationData>(`api/v1/organization/?organization_id=${clientId}`, token)
//             setData(data)

//             setTerminals(data.terminals || [])
//             setWarehouses(data.warehouses || [])
//             // setVehicleProfiles(data.vehicleProfiles || [])
//             setVehicleProfiles(data.vehicleProfiles as VehicleProfile[]);
//             setExtraServices(data.extraServices || [])
//         } catch (error) {
//             console.error('Ошибка при загрузке данных организации:', error)
//         }
//     }

//     const handleSave = async () => {
//         const token = localStorage.getItem('authToken')

//         const updatedFields = Object.keys(formData).reduce((acc, key) => {
//             if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
//                 acc[key] = formData[key]
//             }
//             return acc
//         }, {})

//         if (Object.keys(updatedFields).length === 0) {
//             alert('Нет изменений для сохранения.')
//             return
//         }

//         try {
//             await postData2(`api/v1/bids/${formData._id}`, updatedFields, token)
//             alert('Заявка успешно обновлена!')
//             handleCloseModal()
//         } catch (error) {
//             console.error('Ошибка при обновлении заявки:', error)
//         }
//     }
//     const handleEdit = () => {
//         handleClientChange(formData.client?.organizationId)
//         setIsFetched(false)
//         // console.log(data)
//     }

//     useEffect(() => {
//         if (data) {
//             setIsReadOnly(false)
//         }
//     }, [data])

//     return (
//         <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
//             <DialogTitle></DialogTitle>
//             <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
//                 <div className='relative bg-white rounded-lg'>
//                     <div className='p-6 space-y-6'>
//                         <BidHeader formData={formData} />
//                         <BidDetails
//                             formData={formData}
//                             handleChange={handleChange}
//                             isReadOnly={isReadOnly}
//                             clients={clients}
//                             handleClientChange={handleClientChange}
//                             isFetched={isFetched}
//                             vehicleProfiles={vehicleProfiles}
//                         />
//                         <BidRoute
//                             formData={formData}
//                             handleChange={handleChange}
//                             isReadOnly={isReadOnly}
//                             terminals={terminals}
//                             warehouses={warehouses}
//                         />
//                         <BidFinance
//                             formData={formData}
//                             handleChange={handleChange}
//                             isReadOnly={isReadOnly}
//                             extraServices={extraServices}
//                         />
//                         <div className='flex justify-center gap-4 py-6'>
//                             <Button
//                                 disabled={isReadOnly}
//                                 onClick={handleSave}
//                                 className='bg-orange-500 hover:bg-orange-600 text-white'
//                             >
//                                 Сохранить изменения
//                             </Button>
//                             <Button disabled={isReadOnly} className='bg-orange-500 hover:bg-orange-600 text-white'>
//                                 Сохранить заявку как новую
//                             </Button>
//                             <Button onClick={handleEdit} className='bg-orange-500 hover:bg-orange-600 text-white'>
//                                 Редактировать
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default BidsInfoModal

import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'

import { fetchPrivateData, postData2 } from '@/api/api'

import BidDetails from './bid-form-detail/bidDetails'
import BidDate from './bid-form-detail/bidDate'
import TerminalOne from './bid-form-detail/terminalOne'
import Warehouses from './bid-form-detail/warhouses'
import TerminalTwo from './bid-form-detail/terminalTwo'
import BidDescribe from './bid-form-detail/bidDescribe'
import { Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Modal } from '@/components/ui/modal'

import type { VehicleProfile } from '@/types'

interface OrganizationData {
    terminals: { id: number; name: string; description: string }[]
    warehouses: { id: number; name: string; description: string }[]
    // vehicleProfiles: { id: number; name: string }[];
    vehicleProfiles: Pick<VehicleProfile, 'id' | 'name'>[]
    extraServices: { id: number; name: string; description: string }[]
}

interface BidFormData {
    client: string
    loadingType: string
    transportType: string
    startDate: string
    endDate: string
    terminal1Id: number | null
    terminal1Name: string
    terminal1Address: string
    terminal2Id: number | null
    terminal2Name: string
    terminal2Address: string
    warehouseName: string
    warehouses: any
    warehouseAddress: string
    vehicleProfiles: string | number
    price: number
    description: string
    requestPrice: boolean
    cargoTitle: string
    vehicleCount: number
    extraServices: Array<{ id: number; count: number }>
    filingTime: string
    priceNds: number
}

interface ClientData {
    organizationId: number
    organizationName: string
}

interface OrganizationData {
    terminals: { id: number; name: string; description: string }[]
    warehouses: { id: number; name: string; description: string }[]
    vehicleProfiles: { id: number; name: string }[]
    extraServices: { id: number; name: string; description: string }[]
}

const BidsInfoModal = ({
    open,
    handleCloseModal,
    selectedBid,
    onOpenChange
}: {
    open
    handleCloseModal
    selectedBid
    onOpenChange?: any
}) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
    const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
    const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])
    //@ts-ignore
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [operationType, setOperationType] = useState('')
    const [transportType, setTransportType] = useState('')
    const [isClientSelected, setIsClientSelected] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    //@ts-ignore
    const [isLoading, setIsLoading] = useState(false)
    //@ts-ignore
    const [originalData, setOriginalData] = useState({})
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
    //@ts-ignore
    const [data, setData] = useState<OrganizationData | undefined>(undefined)
    //@ts-ignore
    const [isFetched, setIsFetched] = useState(true)
    const [formData, setFormData] = useState({ ...selectedBid })

    const hideTerminal1 = operationType === 'loading' && transportType === 'Вагон'
    const hideTerminal2 = operationType === 'unloading' && transportType === 'Вагон'

    const formMethods = useForm<BidFormData>({
        defaultValues: {
            client: '',
            loadingType: '',
            transportType: '',
            startDate: '',
            endDate: '',
            terminal1Name: '',
            terminal1Address: '',
            vehicleProfiles: '',
            terminal2Name: '',
            terminal2Address: '',
            warehouseName: '',
            warehouseAddress: '',
            price: 0,
            description: '',
            requestPrice: false,
            extraServices: [],
            warehouses: [{ name: '', address: '' }]
        }
    })
    console.log('selectedBid', selectedBid)

    const {
        //@ts-ignore
        handleSubmit,
        setValue,
        //@ts-ignore
        getValues,
        reset,
        formState: { errors }
    } = formMethods

    useEffect(() => {
        const loadClients = async () => {
            try {
                const token = localStorage.getItem('authToken') || ''
                const data = await fetchPrivateData<ClientData[]>('api/v1/organization/clients', token)
                setClients(data)
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error)
            }
        }
        loadClients()
    }, [])

    useEffect(() => {
        if (selectedBid && Object.keys(selectedBid).length > 0) {
            setIsEdit(false)
            setOriginalData({ ...selectedBid })
            setFormData({ ...selectedBid })
            setIsReadOnly(true)

            if (selectedBid.client?.organizationId) {
                setValue('client', selectedBid.client.organizationId.toString())
                handleClientChange(selectedBid.client.organizationId.toString())
            }

            setValue('loadingType', selectedBid.loadingMode || '')
            setValue('transportType', selectedBid.cargoType || '')
            setOperationType(selectedBid.loadingMode || '')
            setTransportType(selectedBid.cargoType || '')

            setValue('startDate', selectedBid.loadingDate || '')
            setValue('endDate', selectedBid.endDate || '')
            setValue('filingTime', selectedBid.filingTime || '08:00')

            if (selectedBid.terminal1) {
                setValue('terminal1Id', selectedBid.terminal1.cityId || null)
                setValue('terminal1Name', selectedBid.terminal1.cityName || '')
                setValue('terminal1Address', selectedBid.terminal1.address || '')
            }

            if (selectedBid.terminal2) {
                setValue('terminal2Id', selectedBid.terminal2.cityId || null)
                setValue('terminal2Name', selectedBid.terminal2.cityName || '')
                setValue('terminal2Address', selectedBid.terminal2.address || '')
            }

            if (selectedBid.warehouses?.length) {
                setValue(
                    'warehouses',
                    selectedBid.warehouses.map(wh => ({
                        name: wh.cityName || '',
                        address: wh.address || ''
                    }))
                )
            }

            if (selectedBid.vehicleProfileId) {
                setValue('vehicleProfiles', selectedBid.vehicleProfileId)
            }

            setValue('price', selectedBid.price || 0)
            setValue('priceNds', selectedBid.priceNds || 0)
            setValue('requestPrice', selectedBid.isPriceRequest || false)

            setValue('description', selectedBid.description || '')
            setValue('cargoTitle', selectedBid.cargoTitle || '')
            setValue('vehicleCount', selectedBid.vehicleCount || 1)

            if (selectedBid.extraServices?.length) {
                setValue(
                    'extraServices',
                    selectedBid.extraServices.map(es => ({
                        id: es.id,
                        count: es.count
                    }))
                )
            }
        } else {
            reset()
            setIsEdit(false)
            setIsReadOnly(false)
        }
    }, [selectedBid, reset, setValue])

    console.log('terminals', terminals)

    const handleClientChange = async (clientId: string) => {
        setValue('client', clientId)
        try {
            const token = localStorage.getItem('authToken') || ''
            const data = await fetchPrivateData<OrganizationData>(
                `api/v1/organization/?organization_id=${clientId}`,
                token
            )

            setTerminals(data.terminals || [])
            setWarehouses(data.warehouses || [])
            setVehicleProfiles(data.vehicleProfiles || [])
            setExtraServices(data.extraServices || [])
            setIsClientSelected(true)
        } catch (error) {
            console.error('Ошибка при загрузке данных организации:', error)
        }
    }

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')
        const currentFormValues = formMethods.getValues()

        // Create updated fields object from form values
        const updatedFields = {
            client: { organizationId: Number.parseInt(currentFormValues.client) },
            loadingMode: currentFormValues.loadingType,
            cargoType: currentFormValues.transportType,
            loadingDate: currentFormValues.startDate,
            endDate: currentFormValues.endDate,
            filingTime: currentFormValues.filingTime,
            terminal1: {
                cityId: currentFormValues.terminal1Id,
                cityName: currentFormValues.terminal1Name,
                address: currentFormValues.terminal1Address
            },
            terminal2: {
                cityId: currentFormValues.terminal2Id,
                cityName: currentFormValues.terminal2Name,
                address: currentFormValues.terminal2Address
            },
            warehouses: currentFormValues.warehouses.map(wh => ({
                cityName: wh.name,
                address: wh.address
            })),
            vehicleProfileId: currentFormValues.vehicleProfiles,
            price: currentFormValues.price,
            priceNds: currentFormValues.priceNds,
            isPriceRequest: currentFormValues.requestPrice,
            description: currentFormValues.description,
            cargoTitle: currentFormValues.cargoTitle,
            vehicleCount: currentFormValues.vehicleCount,
            extraServices: currentFormValues.extraServices
        }

        try {
            setIsLoading(true)
            await postData2(`api/v1/bids/${selectedBid.id}`, updatedFields, token)
            alert('Заявка успешно обновлена!')
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
            setErrorMessage('Ошибка при обновлении заявки')
        } finally {
            setIsLoading(false)
        }
    }
    console.log(formData.client)

    const handleEdit = () => {
        if (formData.client?.organizationId) {
            handleClientChange(formData.client.organizationId.toString())
        }
        setIsFetched(false)
        setIsReadOnly(false)
    }

    useEffect(() => {
        if (data) {
            setIsReadOnly(false)
        }
    }, [data])

    useEffect(() => {
        const subscription = formMethods.watch(value => {
            setFormData(prevData => ({
                ...prevData,
                ...value
            }))
        })

        return () => subscription.unsubscribe()
    }, [formMethods])

    const saveAsNew = async () => {
        setIsEdit(false)
        // handleSubmit(onSubmit)()
    }

    return (
        <Modal
            isOpen={open}
            onClose={handleCloseModal}
            className={'!bg-background !p-0 md:w-[800px] w-full h-full md:h-[90vh]  flex justify-center'}
        >
            <FormProvider {...formMethods}>
                <ScrollArea className='h-[95dvh] md:h-[87dvh] md:px-6 px-0'>
                    <div className='px-0 md:px-2 xl:h-auto h-screen'>
                        <Heading
                            title={isEdit ? 'Редактировать заявку' : 'Создать новую заявку'}
                            description={''}
                            className='hidden md:block space-y-2 py-0 md:py-4 text-center text-[#fff]'
                        />
                        <div className='flex md:hidden items-center gap-2 bg-primary text-white p-4'>
                            <h2 className='text-lg font-medium'>
                                {isEdit ? 'Редактировать заявку' : 'Создать новую заявку'}
                            </h2>
                        </div>
                        {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
                        <form className='space-y-4'>
                            <div className='space-y-4'>
                                <div>
                                    <BidDetails
                                        filteredClients={clients}
                                        vehicleProfiles={vehicleProfiles}
                                        handleClientChange={handleClientChange}
                                        setOperationType={setOperationType}
                                        setTransportType={setTransportType}
                                        isReadOnly={isReadOnly}
                                    />
                                </div>
                                <div className={isClientSelected ? '' : 'opacity-50 pointer-events-none'}>
                                    <div className='bg-slate-300 text-center text-[26px] my-3 py-3'>
                                        <p>Маршрут</p>
                                    </div>
                                    <div className='px-6 md:px-0 flex flex-col gap-6'>
                                        {!hideTerminal1 && (
                                            <TerminalOne terminals={terminals} isReadOnly={isReadOnly} />
                                        )}
                                        <Warehouses warehouses={warehouses} isReadOnly={isReadOnly} />
                                        {!hideTerminal2 && (
                                            <TerminalTwo terminals={terminals} isReadOnly={isReadOnly} />
                                        )}
                                    </div>
                                    <BidDate isReadOnly={isReadOnly} />

                                    {/* @ts-expect-error handle types later */}
                                    <BidDescribe extraServices={extraServices} isReadOnly={isReadOnly} />
                                </div>
                            </div>
                            {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
                            {Object.keys(errors).length > 0 && (
                                <div className='text-red-500 text-center py-2'>Заполните все обязательные поля</div>
                            )}
                            <div className='flex justify-center h-full md:flex-row flex-col gap-4 px-6 md:px-0 py-6'>
                                <Button
                                    disabled={isReadOnly || isLoading}
                                    onClick={handleSave}
                                    type='button'
                                    className='bg-orange-500 hover:bg-orange-600 text-white'
                                >
                                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    Сохранить изменения
                                </Button>
                                <Button
                                    type='button'
                                    disabled={isReadOnly || isLoading}
                                    onClick={saveAsNew}
                                    className='bg-orange-500 hover:bg-orange-600 text-white'
                                >
                                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    Сохранить заявку как новую
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleEdit}
                                    disabled={isLoading}
                                    className='bg-orange-500 hover:bg-orange-600 text-white'
                                >
                                    Редактировать
                                </Button>
                            </div>
                        </form>
                    </div>
                </ScrollArea>
            </FormProvider>
        </Modal>
    )
}

export default BidsInfoModal
