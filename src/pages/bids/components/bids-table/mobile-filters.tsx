import { useState, useEffect } from 'react';
import { useFilter } from '@/context/filter-context';

export function MobileFilters() {
    const { filters, handleFilterChange } = useFilter();
    // const [isOpen, setIsOpen] = useState(false);
    // @ts-expect-error надо разобраться
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        // Component mount bo'lganda va filters o'zgarganda
        if (!filters.status || filters.status.length === 0) {
            handleFilterChange('status', ['active_waiting']);
        }
        setLocalFilters(filters);
    }, [filters, handleFilterChange]);
// @ts-expect-error надо разобраться
    const resetFilters = () => {
        const defaultFilters = {
            status: ['active_waiting'], // Reset qilganda ham active_waiting ga qaytarish
            terminal1: '',
            warehouse: '',
            terminal2: ''
        };
        setLocalFilters(defaultFilters);
        Object.entries(defaultFilters).forEach(([key, value]) => {
            handleFilterChange(key, value);
        });
    };

    // ... existing code ...
} 