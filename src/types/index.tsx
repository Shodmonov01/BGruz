import { Icons } from '@/components/ui/icons'

export interface NavItem {
    title: string
    href: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
    description?: string
}

export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[]
}

export interface FooterItem {
    title: string
    items: {
        title: string
        href: string
        external?: boolean
    }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export interface Terminal {
    id: number
    name: string
    description: string
}

export interface Warehouse {
    id: number
    name: string
    description: string
}

export interface JoinedCity {
    id: number
    name: string
    description: string
}

export interface Direction {
    id: number
    fromCityId: number
    toCityId: number
    price: number
}

export interface VehicleProfile {
    id: number
    name: string
    downloadTypeId: number
    tonnageId: number
    vehicleTypeId: number
    sortOrder: number
}

export interface UserContext {
    userId: number
    fullName: string
    organizationId: number
    organizationName: string
    organizationTypeCode: string
}

export interface ExtraService {
    classId: number
    count: number
    countIncluded: number
    id: number
    name: string
    packsDetailId: number
    maxCount: number
    price: number
    priceNds: number
    vehicleProfileId: number
    vehicleProfileName: string
    sortOrder: number
}

export interface ApiResponse {
    terminals: Terminal[]
    warehouses: Warehouse[]
    joined_cities: JoinedCity[]
    directions: Direction[]
    vehicleProfiles: VehicleProfile[]
    userContext: UserContext
    extraServices: ExtraService[]
    activationDelay: number
}

export interface IOrder {
    _id?: number
    buyBid: {
        loadingMode?: string
        cargoType?: string
        loadingDate: string
        terminal1: {
            cityId?: number
            cityName?: string
            address?: string
        }
        terminal2?: {
            cityId?: number
            cityName?: string
            address?: string
        }
        warehouses: {
            cityId: number
            cityName: string
            address: string
        }[]
        vehicleProfile?: {
            id?: number
            name?: string
        }
        customer?: {
            organizationId?: number
            organizationName?: string
            userId?: number
        }
    }
    createdAt?: string
    customer?: {
        fio?: string
        phone?: string
        email?: string
        organizationName?: string
        organizationPhone?: string
        inn?: string
    }
    carrier?: {
        fio?: string
        phone?: string
        email?: string
        organizationName?: string
        organizationPhone?: string
        inn?: string
    }
    status?: string
    statusUpdated?: string
    price?: number
    priceNds?: number
    fullPrice?: number
    fullPriceNds?: number
    commission?: number
    extraServicesPrice?: number
    extraServicesPriceNds?: number
    extraServices?: {
        orderExtraServiceId: number
        billableCount: number
        count: number
        price: number
        priceNds: number
        totalPrice: number
        totalPriceNds: number
        sortOrder: number
        maxCount: number
        factoringMultiplier: number
        totalFactoringMultiplier: number
        packsDetailId: number
        name: string
        id: number
    }[]
    assignedVehicle?: {
        vehicleId: number
        organizationId: number
        vehicleClassId: number
        vehicleProfileId: number
        plateNum: string
        docModel: string
    }
    assignedTrailer?: {
        vehicleId: number
        organizationId: number
        vehicleClassId: number
        vehicleProfileId: number
        plateNum: string
        docModel: string | null
    }
    assignedVehicleFiles?: {
        id: number
        link: string
        name: string
        mime: string
        description: string | null
        uploadTime: string
        editPermission: boolean
    }[]
    assignedTrailerFiles?: {
        id: number
        link: string
        name: string
        mime: string
        description: string | null
        uploadTime: string
        editPermission: boolean
    }[]
    assignedDriverFiles?: any[]
    documentOrderItems?: any[]
}
