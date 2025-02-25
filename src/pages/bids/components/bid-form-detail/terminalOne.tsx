import { useState } from 'react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext, useWatch } from 'react-hook-form'

function TerminalOne({ terminals }) {
    const { control, setValue } = useFormContext()
    const loadingType = useWatch({ control, name: 'loadingType' })
    const transportType = useWatch({ control, name: 'transportType' })

    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const getTerminalTitle = () => {
        if (transportType === 'Контейнер') return 'Получить контейнер'
        if (transportType === 'Вагон' && loadingType === 'Выгрузка') return 'Терминал выгрузки'
        return 'Терминал 1'
    }

    const sortedTerminals = [...terminals]
        .sort((a, b) => a.name.localeCompare(b.name)) // Сортировка по алфавиту
        .filter(t => t.name.toLowerCase().includes(search.toLowerCase())) // Фильтрация по поиску

    return (
        <div className='md:mb-0 mb-8'>
            <h1 className='font-bold mb-2'>{getTerminalTitle()}</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4'>
                <FormField
                    control={control}
                    name='terminal1Name'
                    rules={{ required: 'Пожалуйста, выберите терминал' }}
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={value => {
                                    if (!isOpen) return
                                    field.onChange(value)
                                    const selectedTerminal = terminals.find(terminal => terminal.id === Number(value))
                                    if (selectedTerminal) {
                                        setValue('terminal1Address', selectedTerminal.description || '')
                                        setValue('terminal1Id', selectedTerminal.id) // сохраняем ID терминала
                                    }
                                }}
                                open={isOpen}
                                onOpenChange={setIsOpen}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Выберите терминал 1' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* Поле для поиска */}
                                    <div className='p-2'>
                                        <Input
                                            placeholder='Поиск терминала...'
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            onFocus={() => setIsOpen(true)}
                                            onKeyDown={e => e.stopPropagation()}
                                            className='w-full px-3 py-2 border rounded-md'
                                        />
                                    </div>
                                    {/* Список терминалов */}
                                    {sortedTerminals.length > 0 ? (
                                        sortedTerminals.map(terminal => (
                                            <SelectItem key={terminal.id} value={terminal.id.toString()}>
                                                {terminal.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className='p-2 text-center text-gray-500'>Ничего не найдено</div>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='terminal1Address'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder='Адрес'
                                    {...field}
                                    className=''
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default TerminalOne
