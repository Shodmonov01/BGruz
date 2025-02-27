import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ListFilter } from 'lucide-react'

export function RenderFilterMobile({ handleFilterChange, currentStatus }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(currentStatus)

    const handleApply = () => {
        handleFilterChange('status', selectedStatus)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setSelectedStatus(currentStatus) // Сбрасываем выбор
        setIsOpen(false)
    }

    return (
        <div className='ml-2'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size='icon'>
                        <ListFilter className="h-[1.2rem] w-[1.2rem]"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 m-4">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Активный</SelectItem>
                            <SelectItem value="waiting">Ожидание</SelectItem>
                            <SelectItem value="canceled">Отменен</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={handleCancel}>Отмена</Button>
                        <Button size="sm" onClick={handleApply}>Применить</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}