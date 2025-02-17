import { useCallback } from 'react'

export function useFormatNumber() {
    const formatNumber = useCallback((value: string) => {
        const num = value.replace(/\D/g, '') // Убираем все нечисловые символы
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }, [])

    return { formatNumber }
}
