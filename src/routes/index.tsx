import NotFound from '@/pages/not-found'
import { Suspense, lazy } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import BidsPage from '@/pages/bids'
import OrderPage from '@/pages/orders'
import { FilterProvider } from '@/context/filter-context'

const DashboardLayout = lazy(() => import('@/components/layout/dashboard-layout'))
const SignInPage = lazy(() => import('@/pages/auth/signin'))

export default function AppRouter() {
    const dashboardRoutes = [
        {
            path: '/',
            element: (
                <PrivateRoute>
                    {/* @ts-expect-error надо что то сделать */}
                    <FilterProvider>
                        <DashboardLayout>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Outlet />
                            </Suspense>
                        </DashboardLayout>
                    </FilterProvider>
                </PrivateRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to='bids' replace />
                },
                {
                    path: 'bids',
                    element: <BidsPage />,
                    index: true
                },
                {
                    path: 'orders',
                    element: <OrderPage />
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
