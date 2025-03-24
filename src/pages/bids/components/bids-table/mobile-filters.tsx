import { useState, useEffect } from 'react'
import { useFilter } from '@/context/filter-context'

export function MobileFilters() {
    const { filters, handleFilterChange } = useFilter()
    // @ts-expect-error надо разобраться
    const [localFilters, setLocalFilters] = useState(filters)

    useEffect(() => {
        if (!filters.status || filters.status.length === 0) {
            handleFilterChange('status', ['active_waiting'])
        }
        setLocalFilters(filters)
    }, [filters, handleFilterChange])

}
