// import { useEffect, useState } from 'react'
// import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
// import Heading from '@/components/shared/heading'
// import { Button } from '@/components/ui/button'
// import { fetchPrivateData } from '@/api/api'
// import BidDetails from '../bidForms/bidDetails'
// import BidDate from '../bidForms/bidDate'
// import TerminalOne from '../bidForms/terminalOne'
// import Warhouses from '../bidForms/warhouses'
// import TerminalTwo from '../bidForms/terminalTwo'
// import BidDescribe from '../bidForms/bidDescribe'

// interface BidFormData {
//     client: string
//     loadingType: string
//     transportType: string
//     startDate: string
//     endDate: string
//     terminal1Name: string
//     terminal1Address: string
//     vehicleProfiles: string
//     terminal2Name: string
//     terminal2Address: string
//     warehouseName: string
//     warehouseAddress: string
//     price: number
//     description: string
//     requestPrice: boolean
// }

// const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
//     const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
//     const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
//     const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
//     const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
//     const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])

//     const operationType = watch('loadingType')
//     const transportType = watch('transportType')

//     const hideTerminal1 = operationType === 'Погрузка' && transportType === 'Вагон'
//     const hideTerminal2 = operationType === 'Выгрузка' && transportType === 'Вагон'

//     useEffect(() => {
//         const loadClients = async () => {
//             try {
//                 const token = localStorage.getItem('authToken')
//                 const data = await fetchPrivateData('api/v1/organization/clients', token)
//                 setClients(data)
//             } catch (error) {
//                 console.error('Ошибка при загрузке клиентов:', error)
//             }
//         }
//         loadClients()
//     }, [])

//     const formMethods = useForm<BidFormData>({
//         defaultValues: {
//             client: '',
//             loadingType: '',
//             transportType: '',
//             startDate: '',
//             endDate: '',
//             terminal1Name: '',
//             terminal1Address: '',
//             vehicleProfiles: '',
//             terminal2Name: '',
//             terminal2Address: '',
//             warehouseName: '',
//             warehouseAddress: '',
//             price: 0,
//             description: '',
//             requestPrice: false
//         }
//     })

//     const { handleSubmit, setValue } = formMethods

//     const handleClientChange = async (clientId: string) => {
//         setValue('client', clientId)
//         try {
//             const token = localStorage.getItem('authToken')
//             const data = await fetchPrivateData(`api/v1/organization/?organization_id=${clientId}`, token)
//             console.log(data);

//             setTerminals(data.terminals || [])
//             setWarehouses(data.warehouses || [])
//             setVehicleProfiles(data.vehicleProfiles || [])
//             setExtraServices(data.extraServices || [])
//         } catch (error) {
//             console.error('Ошибка при загрузке данных организации:', error)
//         }
//     }

//     const onSubmit: SubmitHandler<BidFormData> = async (data) => {
//         try {
//             console.log('Форматируем данные:', data)
//             console.log('Amir');

//             modalClose()
//         } catch (error) {
//             console.error('Ошибка при создании заявки:', error)
//         }
//     }

//     return (
//         <FormProvider {...formMethods}>
//             <div className='px-2'>
//                 <Heading title={'Создать новую заявку'} description={''} className='space-y-2 py-4 text-center' />
//                 <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' autoComplete='off'>
//                     <div className='space-y-4'>
//                         <BidDetails filteredClients={clients} vehicleProfiles={vehicleProfiles} handleClientChange={handleClientChange} />
//                         <BidDate />
//                         {!hideTerminal1 && <TerminalOne terminals={terminals} />}
//                         <Warhouses warehouses={warehouses} />
//                         {!hideTerminal2 && <TerminalTwo terminals={terminals} />}
//                         <BidDescribe extraServices={extraServices} />
//                     </div>
//                     <div className='flex items-center justify-center gap-4'>
//                         <Button type='button' variant='secondary' className='rounded-full' size='lg' onClick={modalClose}>
//                             Отмена
//                         </Button>
//                         <Button type='submit' className='rounded-full' size='lg'>
//                             Создать заявку
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </FormProvider>
//     )
// }

// export default StudentCreateForm

import { useEffect, useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'
import { fetchPrivateData, postData } from '@/api/api'
import BidDetails from '../bidForms/bidDetails'
import BidDate from '../bidForms/bidDate'
import TerminalOne from '../bidForms/terminalOne'
import Warhouses from '../bidForms/warhouses'
import TerminalTwo from '../bidForms/terminalTwo'
import BidDescribe from '../bidForms/bidDescribe'

interface BidFormData {
    client: string
    loadingType: string
    transportType: string
    startDate: string
    endDate: string
    terminal1Name: string
    terminal1Address: string
    vehicleProfiles: string
    terminal2Name: string
    terminal2Address: string
    warehouseName: string
    warehouseAddress: string
    price: number
    description: string
    requestPrice: boolean
}

const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
    const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
    const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])

    // Перемещаем состояния в родительский компонент
    const [operationType, setOperationType] = useState('')
    const [transportType, setTransportType] = useState('')

    const hideTerminal1 = operationType === 'Погрузка' && transportType === 'Вагон'
    const hideTerminal2 = operationType === 'Выгрузка' && transportType === 'Вагон'

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
            requestPrice: false
        }
    })

    const { handleSubmit, setValue } = formMethods

    const handleClientChange = async (clientId: string) => {
        setValue('client', clientId)
        try {
            const token = localStorage.getItem('authToken')
            const data = await fetchPrivateData(`api/v1/organization/?organization_id=${clientId}`, token)

            setTerminals(data.terminals || [])
            setWarehouses(data.warehouses || [])
            setVehicleProfiles(data.vehicleProfiles || [])
            setExtraServices(data.extraServices || [])
        } catch (error) {
            console.error('Ошибка при загрузке данных организации:', error)
        }
    }

    // const onSubmit: SubmitHandler<BidFormData> = async (data) => {
    //     try {
    //         console.log('Форматируем данные:', data)
    //         modalClose()
    //     } catch (error) {
    //         console.error('Ошибка при создании заявки:', error)
    //     }
    // }

    const onSubmit: SubmitHandler<BidFormData> = async data => {
        try {
            const payload = {
                cargoType: data.transportType || 'container',
                loadingMode: data.loadingType || 'loading',
                clientId: Number(data.client) || 0,
                startDate: data.startDate || new Date().toISOString().split('T')[0],
                slideDayTotal: 0,
                terminal1: {
                    cityId: 0,
                    cityName: data.terminal1Name || 'Не указан',
                    address: data.terminal1Address || 'Не указан'
                },
                terminal2: {
                    cityId: 0,
                    cityName: data.terminal2Name || 'Не указан',
                    address: data.terminal2Address || 'Не указан'
                },
                warehouses: data.warehouseName
                    ? [
                          {
                              cityId: 0,
                              cityName: data.warehouseName,
                              address: data.warehouseAddress || 'Не указан'
                          }
                      ]
                    : [],
                isPriceRequest: data.requestPrice || false,
                price: data.price || 0,
                vehicleProfileId: Number(data.vehicleProfiles) || 0,
                vehicleCount: 1,
                cargoTitle: 'Груз',
                filingTime: '00:00',
                extraServices: [],
                description: data.description || 'Нет описания',
                persistentId: Math.random().toString(36).substr(2, 10)
            }

            console.log('Отправка данных:', payload)

            await postData('/api/v1/bids', payload)

            modalClose()
        } catch (error) {
            console.error('Ошибка при создании заявки:', error)
        }
    }

    return (
        <FormProvider {...formMethods}>
            <div className='px-2'>
                <Heading title={'Создать новую заявку'} description={''} className='space-y-2 py-4 text-center' />
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' autoComplete='off'>
                    <div className='space-y-4'>
                        <BidDetails
                            filteredClients={clients}
                            vehicleProfiles={vehicleProfiles}
                            handleClientChange={handleClientChange}
                            setOperationType={setOperationType}
                            setTransportType={setTransportType}
                        />
                        <BidDate />
                        {!hideTerminal1 && <TerminalOne terminals={terminals} />}
                        <Warhouses warehouses={warehouses} />
                        {!hideTerminal2 && <TerminalTwo terminals={terminals} />}
                        <BidDescribe extraServices={extraServices} />
                    </div>
                    <div className='flex items-center justify-center gap-4'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='rounded-full'
                            size='lg'
                            onClick={modalClose}
                        >
                            Отмена
                        </Button>
                        <Button type='submit' className='rounded-full' size='lg'>
                            Создать заявку
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    )
}

export default StudentCreateForm
