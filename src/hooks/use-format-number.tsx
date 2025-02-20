import { useCallback } from 'react'

const useNumberFormatter = () => {
    const formatNumber = useCallback((value: number | string) => {
        return Number(value).toLocaleString('ru-RU').replace(/,/g, ' ')
    }, [])

    return { formatNumber }
}

export default useNumberFormatter
