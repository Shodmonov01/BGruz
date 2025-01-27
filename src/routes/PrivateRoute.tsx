import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    children: ReactNode // Дети — это может быть любой компонент
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('authToken')

    if (!token) {
        // Если токен отсутствует, перенаправляем на страницу входа
        return <Navigate to='/login' replace />
    }

    // Если токен есть, разрешаем доступ к детям компонента (страницам)
    return <>{children}</>
}

export default PrivateRoute
