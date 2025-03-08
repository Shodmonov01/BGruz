import { Suspense, lazy } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import { FilterProvider } from '@/context/filter-context'

const DashboardLayout = lazy(() => import('@/components/layout/dashboard-layout'))
const SignInPage = lazy(() => import('@/pages/auth/signin'))
const BidsPage = lazy(() => import('@/pages/bids'))
const OrderPage = lazy(() => import('@/pages/orders'))

import NotFound from '@/pages/not-found'

export default function AppRouter() {
    const dashboardRoutes = [
        {
            path: '/',
            element: (
                <PrivateRoute>
                    <DashboardLayout>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Outlet />
                        </Suspense>
                    </DashboardLayout>
                </PrivateRoute>
            ),
            children: [
                { index: true, element: <Navigate to='bids' replace /> },
                {
                    path: 'bids',
                    element: (
                        <FilterProvider pageType='bids'>
                            <BidsPage />
                        </FilterProvider>
                    )
                },
                {
                    path: 'orders',
                    element: (
                        <FilterProvider pageType='orders'>
                            <OrderPage />
                        </FilterProvider>
                    )
                }
            ]
        }
    ]

    const publicRoutes = [
        {
            path: '/login',
            element: <SignInPage />,
            index: true
        },
        {
            path: '/404',
            element: <NotFound />
        },
        {
            path: '*',
            element: <Navigate to='/404' replace />
        }
    ]

    const routes = useRoutes([...dashboardRoutes, ...publicRoutes])

    return routes
}
