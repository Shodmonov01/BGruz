import NotFound from '@/pages/not-found'
import { Suspense, lazy } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import BidsPage from '@/pages/bids'

const DashboardLayout = lazy(() => import('@/components/layout/dashboard-layout'))
const SignInPage = lazy(() => import('@/pages/auth/signin'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))



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
                {
                    path: 'bids',
                    element:  <BidsPage />,
                    index: true
                },
                {
                    path: 'orders',
                    element: <DashboardPage />
                },
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
