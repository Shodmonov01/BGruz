import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext, useWatch } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

function TerminalTwo({ terminals, isReadOnly }: { terminals; isReadOnly?: boolean }) {
    const { control, setValue } = useFormContext()

    const loadingType = useWatch({ control, name: 'loadingType' })
    const transportType = useWatch({ control, name: 'transportType' })

    const [search, setSearch] = useState('')
    //@ts-ignore
    const [isOpen, setIsOpen] = useState(false)

    const getTerminalTitle = () => {
        if (transportType === 'Контейнер') return 'Сдать контейнер'
        if (transportType === 'Вагон' && loadingType === 'Погрузка') return 'Терминал погрузки'
        return 'Терминал 2'
    }

    // const sortedTerminals = [...terminals]
    //     .sort((a, b) => a.name.localeCompare(b.name)) // Сортировка по алфавиту
    //     .filter(t => t.name.toLowerCase().includes(search.toLowerCase())) // Фильтрация по поиску

    const sortedTerminals = terminals
        ?.filter(
            t =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.description?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div>
            <h1 className='font-bold mb-2'>{getTerminalTitle()}</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4'>
                {/* <FormField
                    control={control}
                    name='terminal2Name' 
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={value => {
                                    if (!isOpen) return
                                    field.onChange(value)
                                    const selectedTerminal = terminals.find(terminal => terminal.id === Number(value))
                                    if (selectedTerminal) {
                                        setValue('terminal2Address', selectedTerminal.description || '')
                                        setValue('terminal2Id', selectedTerminal.id) 
                                    }
                                }}
                                value={field.value}
                                open={isOpen}
                                onOpenChange={setIsOpen}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Выберите терминал 2' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <div className='p-2'>
                                        <Input
                                            placeholder='Поиск терминала...'
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            onFocus={() => setIsOpen(true)}
                                            onKeyDown={e => e.stopPropagation()}
                                            className='w-full border rounded-md'
                                        />
                                    </div>
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
                /> */}

                <FormField
                    control={control}
                    name='terminal2Id' // Работаем с ID терминала
                    rules={{ required: 'Пожалуйста, выберите терминал' }}
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                disabled={isReadOnly}
                                onValueChange={value => {
                                    const selectedTerminal = terminals.find(t => t.id === Number(value))
                                    if (selectedTerminal) {
                                        field.onChange(selectedTerminal.id) // Сохраняем ID
                                        setValue('terminal2Name', selectedTerminal.name)
                                        setValue('terminal2Address', selectedTerminal.description || '')
                                    }
                                }}
                                value={field.value?.toString()} // Значение должно быть строкой
                            >
                                <SelectTrigger>
                                    {/* Отображаем название выбранного терминала */}
                                    <SelectValue placeholder='Выберите терминал'>
                                        {terminals.find(t => t.id === field.value)?.name || ''}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <div className='p-2'>
                                        <Input
                                            placeholder='Поиск терминала...'
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            onFocus={() => setIsOpen(true)}
                                            onKeyDown={e => e.stopPropagation()}
                                            className='w-full border rounded-md'
                                        />
                                    </div>
                                    {sortedTerminals.map(terminal => (
                                        <SelectItem
                                            key={terminal.id}
                                            value={terminal.id.toString()} // Значение - ID терминала
                                        >
                                            {terminal.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='terminal2Address'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input disabled={isReadOnly} placeholder='Адрес' {...field} className='' readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Separator className='mt-8' />
        </div>
    )
}

export default TerminalTwo
