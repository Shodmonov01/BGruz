import { useEffect, useState } from 'react'

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'

import BidDetails from '../bidForms/bidDetails'
import BidDate from '../bidForms/bidDate'
import TerminalOne from '../bidForms/terminalOne'
import Warhouses from '../bidForms/warhouses'
import TerminalTwo from '../bidForms/terminalTwo'
import BidDescribe from '../bidForms/bidDescribe'

import { fetchPrivateData, postData } from '@/api/api'

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
    warehouseAddress: string
    vehicleProfiles: string | number
    price: number
    description: string
    requestPrice: boolean
    cargoTitle: string
    vehicleCount: number
    extraServices: Array<{ id: number; count: number }>
}

const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
    const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
    const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Перемещаем состояния в родительский компонент
    const [operationType, setOperationType] = useState('')
    const [transportType, setTransportType] = useState('')

    // const hideTerminal1 = operationType === 'Погрузка' && transportType === 'Вагон'
    // const hideTerminal2 = operationType === 'Выгрузка' && transportType === 'Вагон'

    const hideTerminal1 = operationType === 'loading' && transportType === 'Вагон'
    const hideTerminal2 = operationType === 'unloading' && transportType === 'Вагон'

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
            requestPrice: false,
            extraServices: []
        }
    })

    const { handleSubmit, setValue, getValues } = formMethods
    // const { handleSubmit, setValue } = formMethods

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

    // const onSubmit: SubmitHandler<BidFormData> = async data => {
    //     try {
    //         const payload = {
    //             cargoType: data.transportType,
    //             loadingMode: data.loadingType,

    //             clientId: Number(data.client) || 4751,
    //             startDate: getValues('startDate'),
    //             slideDayTotal: 0,
    //             customerId: Number(data.client) || 4751,
    //             // terminal1: {
    //             //     cityId: data.terminal1Id ,
    //             //     cityName: data.terminal1Name ,
    //             //     address: data.terminal1Address
    //             // },

    //             terminal1: {
    //                 cityId: data.terminal1Id || 1283, // Используем ID из формы
    //                 cityName: data.terminal1Name || 'Раменское.жд',
    //                 address: data.terminal1Address || 'Московская область, Раменское'
    //             },
    //             terminal2: {
    //                 cityId: data.terminal2Id || 1280,
    //                 cityName: data.terminal2Name || 'Ногинск.жд',
    //                 address: data.terminal2Address || 'Московская область, Ногинск Адрес 2'
    //             },

    //             warehouses: data.warehouseName || [
    //                 {
    //                     cityId: 467,
    //                     cityName: data.warehouseName || 'Балашиха',
    //                     address: data.warehouseAddress || 'Балашиха, Склад 1'
    //                 }
    //             ],
    //             isPriceRequest: data.requestPrice || false,
    //             price: data.price || 0,
    //             vehicleProfileId: Number(data.vehicleProfiles),
    //             vehicleCount: getValues('vehicleCount'),
    //             cargoTitle: data.cargoTitle,
    //             filingTime: '00:00',
    //             // extraServices: data.extraServices.map(service => ({
    //             //     id: service.id,
    //             //     vehicleProfileId: Number(data.vehicleProfiles), // Здесь нужно указать правильный vehicleProfileId
    //             //     count: service.count
    //             // })),
    //             extraServices: data.extraServices || [],
    //             description: data.description
    //             // persistentId: Math.random().toString(36).substr(2, 10)
    //         }

    //         console.log('Отправка данных:', payload)
    //         const token = localStorage.getItem('authToken')
    //         if (!token) {
    //             console.error('Не найден токен авторизации')
    //             return
    //         }

    //         await postData('api/v1/bids', payload, token)

    //         modalClose()
    //     } catch (error) {
    //         console.error('Ошибка при создании заявки:', error)
    //     }
    // }

    const onSubmit: SubmitHandler<BidFormData> = async data => {
        try {
            setErrorMessage(null) // Очистка ошибки перед отправкой
            const payload = {
                cargoType: data.transportType,
                loadingMode: data.loadingType,

                clientId: Number(data.client) || 4751,
                startDate: getValues('startDate'),
                slideDayTotal: 0,
                customerId: Number(data.client) || 4751,
                // terminal1: {
                //     cityId: data.terminal1Id ,
                //     cityName: data.terminal1Name ,
                //     address: data.terminal1Address
                // },

                terminal1: {
                    cityId: data.terminal1Id , // Используем ID из формы
                    cityName: data.terminal1Name ,
                    address: data.terminal1Address 
                },
                terminal2: {
                    cityId: data.terminal2Id ,
                    cityName: data.terminal2Name ,
                    address: data.terminal2Address 
                },

                warehouses: data.warehouseName || [
                    {
                        cityId: 467,
                        cityName: data.warehouseName || 'Балашиха',
                        address: data.warehouseAddress || 'Балашиха, Склад 1'
                    }
                ],
                isPriceRequest: data.requestPrice || false,
                price: data.price || 0,
                vehicleProfileId: Number(data.vehicleProfiles),
                vehicleCount: getValues('vehicleCount'),
                cargoTitle: data.cargoTitle,
                filingTime: '00:00',
                // extraServices: data.extraServices.map(service => ({
                //     id: service.id,
                //     vehicleProfileId: Number(data.vehicleProfiles), // Здесь нужно указать правильный vehicleProfileId
                //     count: service.count
                // })),
                extraServices: data.extraServices || [],
                description: data.description
                // persistentId: Math.random().toString(36).substr(2, 10)
            }
            console.log('Отправка данных:', payload)
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                return
            }

            await postData('api/v1/bids', payload, token)
            modalClose()
        } catch (error: any) {
            console.error('Ошибка при создании заявки:', error)

            if (error.response?.status === 404) {
                const detailMessage = error.response.data?.detail
                if (detailMessage?.includes('Destination')) {
                    setErrorMessage(detailMessage)
                }
            }
        }
    }

    return (
        <FormProvider {...formMethods}>
            <div className='px-0 md:px-2'>
                <Heading title={'Создать новую заявку'} description={''} className='space-y-2 py-4 text-center' />
                {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
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
                        {/* @ts-expect-error что нибудь придумаем */}
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
