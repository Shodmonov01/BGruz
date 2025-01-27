import PageHead from '@/components/shared/page-head.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js'
import RecentSales from './components/recent-sales.js'

export default function DashboardPage() {
    return (
        <>
            <PageHead title='Dashboard | App' />
            <div className='max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-3xl font-bold tracking-tight'>Добро Пожаловать 👋</h2>
                </div>
                <h3>тут будут заказы</h3>
            </div>
        </>
    )
}
