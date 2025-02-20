import { NavItem } from '@/types'
import BidsIcon from '@/assets/bids.svg';
import OrdersIcon from '@/assets/orders.svg';

export const navItems: NavItem[] = [
    {
        title: 'Заявки',
        href: '/bids',
        icon: BidsIcon,        
        label: 'Dashboard'
    },
    {
        title: 'Заказы',
        href: '/orders',
        icon: OrdersIcon,
        label: 'Student'
    },
    {
        title: 'Выход',
        href: '/login',
        icon: 'login',
        label: 'Login'
    }
]



export type Employee = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    gender: string
    date_of_birth: string // Consider using a proper date type if possible
    street: string
    city: string
    state: string
    country: string
    zipcode: string
    longitude?: number // Optional field
    latitude?: number // Optional field
    job: string
    profile_picture?: string | null // Profile picture can be a string (URL) or null (if no picture)
}
