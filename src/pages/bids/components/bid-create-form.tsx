import { useEffect, useState } from 'react'

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'

import { fetchPrivateData, postData } from '@/api/api'

import BidDetails from './bid-form-detail/bidDetails'
import BidDate from './bid-form-detail/bidDate'
import TerminalOne from './bid-form-detail/terminalOne'
import Warehouses from './bid-form-detail/warhouses'
import TerminalTwo from './bid-form-detail/terminalTwo'
import BidDescribe from './bid-form-detail/bidDescribe'

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
}

const StudentCreateForm = ({ modalClose }: { modalClose: () => void }) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
    const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
    const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [operationType, setOperationType] = useState('')
    const [transportType, setTransportType] = useState('')
    const [isClientSelected, setIsClientSelected] = useState(false)
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
            extraServices: [],
            warehouses: [{ name: '', address: '' }]
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
            setIsClientSelected(true)
        } catch (error) {
            console.error('Ошибка при загрузке данных организации:', error)
        }
    }

    const onSubmit: SubmitHandler<BidFormData> = async data => {
        try {
            setErrorMessage(null) // Очистка ошибки перед отправкой
            const payload = {
                cargoType: data.transportType,
                loadingMode: data.loadingType,

                clientId: Number(data.recipientOrSender) ,
                startDate: getValues('startDate'),
                slideDayTotal: 0,
                customerId: Number(data.client) ,
                terminal1: {
                    cityId: data.terminal1Id,
                    cityName: data.terminal1Name,
                    address: data.terminal1Address
                },
                terminal2: {
                    cityId: data.terminal2Id,
                    cityName: data.terminal2Name,
                    address: data.terminal2Address
                },

                warehouses: data.warehouses.map(warehouse => ({
                    cityId: warehouse.name,
                    address: warehouse.address
                })),

                isPriceRequest: data.requestPrice,
                price: data.price || 0,
                vehicleProfileId: Number(data.vehicleProfiles),
                vehicleCount: getValues('vehicleCount'),
                cargoTitle: data.cargoTitle,
                filingTime: getValues('submissionTime'),

                extraServices: data.extraServices || [],
                description: data.description
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
                        <div className={isClientSelected ? '' : 'opacity-50 pointer-events-none'}>
                            <BidDate />
                            <div className='bg-primary text-center text-[26px] text-white my-3 py-3'>
                                <p>Маршрут</p>
                            </div>
                            {!hideTerminal1 && <TerminalOne terminals={terminals} />}
                            <Warehouses warehouses={warehouses} />
                            {!hideTerminal2 && <TerminalTwo terminals={terminals} />}
                            <div className='bg-primary text-center text-[26px] text-white my-3 py-3'>
                                <p>Финансы</p>
                            </div>
                            {/* @ts-expect-error что нибудь придумаем */}
                            <BidDescribe extraServices={extraServices} />
                        </div>
                    </div>
                    {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
                    <div className='flex items-center justify-center gap-4'>
                        <Button
                            type='button'
                            variant='secondary'
                            size='lg'
                            onClick={modalClose}
                        >
                            Отмена
                        </Button>
                        <Button variant='tertiary' type='submit' size='lg' disabled={!isClientSelected}>
                            Создать заявку
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    )
}

export default StudentCreateForm
