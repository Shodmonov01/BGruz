import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from './bid-form-detail/rangePicker';

function FilterInput({ column, handleFilterChange }) {
    const filterType = column.columnDef.filterType;
    const filterOptions = column.columnDef.filterOptions;

    const getDefaultValue = (columnId) => {
        switch (columnId) {
            case 'cargoType':
                return ['wagon', 'container'];
            case 'status':
                return ['active', 'waiting'];
            case 'loadingMode':
                return ['loading', 'unloading'];
            default:
                return [];
        }
    };

    useEffect(() => {
        if (filterType === 'select' && !column.getFilterValue()) {
            const defaultValue = getDefaultValue(column.id);
            if (defaultValue.length > 0) {
                column.setFilterValue(defaultValue);
                handleFilterChange(column.id, defaultValue);
            }
        }
    }, [column, filterType, handleFilterChange]);

    const handleChange = (value) => {
        column.setFilterValue(value);
        handleFilterChange(column.id, value);
    };

    const getStringValue = (value) => {
        return Array.isArray(value) ? value.join(',') : value ?? '';
    };

    switch (filterType) {
        case 'exact':
            return (
                <Input
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder='Точное совпадение'
                    className='text-xs min-w-16 h-7 bg-white'
                />
            );
        case 'select':
            // @ts-expect-error IHID DSIJDOS DSKUHD
            const defaultValue = getDefaultValue(column.id);
            return (
                <Select
                    value={getStringValue(column.getFilterValue()) || defaultValue.join(',')}
                    onValueChange={(value) => {
                        const selectedOption = filterOptions?.find(option =>
                            Array.isArray(option.value) ? option.value.join(',') === value : option.value === value
                        );
                        const newValue = selectedOption ? selectedOption.value : defaultValue;
                        handleChange(newValue);
                    }}
                >
                    <SelectTrigger className='text-xs min-w-full h-7 bg-white'>
                        <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions?.map((option) => (
                            <SelectItem
                                key={Array.isArray(option.value) ? option.value.join(',') : option.value}
                                value={Array.isArray(option.value) ? option.value.join(',') : option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case 'dateRange':
            return (
                <DateRangePicker
                    value={column.getFilterValue()}
                    onChange={(range) => handleChange(range)}
                    placeholder='Выберите даты'
                    className='text-xs'
                />
            );
        case 'fuzzy':
            return (
                <Input
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder='Поиск...'
                    className='text-xs h-7 min-w-16 bg-white'
                />
            );
        case 'range':
            return <button className='text-xs h-7 bg-white px-2'>{column.columnDef.header}</button>;
        default:
            return null;
    }
}

export default FilterInput;
