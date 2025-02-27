import type React from 'react'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

interface FilterContextProps {
    filters: { [key: string]: any }
    handleFilterChange: (columnId: string, value: any) => void
    setFilters: (filters: { [key: string]: any }) => void
    clearFilters: () => void
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

interface FilterProviderProps {
    children: React.ReactNode
    onFiltersChange?: (filters: { [key: string]: any }) => void
    initialFilters?: { [key: string]: any }
}

export function FilterProvider({ children, onFiltersChange, initialFilters = {} }: FilterProviderProps) {
    const [filters, setLocalFilters] = useState<{ [key: string]: any }>(initialFilters)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const handleFilterChange = useCallback(
        (columnId: string, value: any) => {
            let formattedValue = value

            if (columnId === 'loadingMode' || columnId === 'cargoType' || columnId === 'status') {
                formattedValue = Array.isArray(value) ? value : [value]
            } else if ((columnId === 'loadingDate' || columnId === 'createdAt') && value) {
                formattedValue = {
                    start: new Date(value.from.setHours(23, 59, 59, 999)).toISOString(),
                    end: new Date(value.to.setHours(23, 59, 59, 999)).toISOString()
                }
            } else if (['number', 'fullPrice', 'comission', 'extraServicesPrice'].includes(columnId)) {
                formattedValue = Number(value)
            }

            const newFilters = {
                ...filters,
                [columnId]: formattedValue
            }

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                setLocalFilters(newFilters)
                if (onFiltersChange) {
                    onFiltersChange(newFilters)
                }
            }, 500)
        },
        [filters, onFiltersChange]
    )

    const setFilters = useCallback(
        (newFilters: { [key: string]: any }) => {
            setLocalFilters(newFilters)
            if (onFiltersChange) {
                onFiltersChange(newFilters)
            }
        },
        [onFiltersChange]
    )

    const clearFilters = useCallback(() => {
        setLocalFilters({})
        if (onFiltersChange) {
            onFiltersChange({})
        }
    }, [onFiltersChange])

    return (
        <FilterContext.Provider value={{ filters, handleFilterChange, setFilters, clearFilters }}>
            {children}
        </FilterContext.Provider>
    )
}

export function useFilter() {
    const context = useContext(FilterContext)
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider')
    }
    return context
}
