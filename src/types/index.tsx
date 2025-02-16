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
