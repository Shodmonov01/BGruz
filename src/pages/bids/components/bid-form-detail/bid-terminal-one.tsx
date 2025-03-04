import { useState } from 'react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext, useWatch } from 'react-hook-form'

function TerminalOne({ terminals, isReadOnly }: { terminals; isReadOnly?: boolean }) {
    const { control, setValue } = useFormContext()
    const loadingType = useWatch({ control, name: 'loadingType' })
    const transportType = useWatch({ control, name: 'transportType' })

    const [search, setSearch] = useState('')
    //@ts-ignore
    const [isOpen, setIsOpen] = useState(false)

    const getTerminalTitle = () => {
        if (transportType === 'Контейнер') return 'Получить контейнер'
        if (transportType === 'Вагон' && loadingType === 'Выгрузка') return 'Терминал выгрузки'
        return 'Терминал 1'
    }

    const sortedTerminals = terminals // Используйте исходный массив без [...terminals]
        ?.filter(
            t =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.description?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className='md:mb-0 mb-8'>
            <h1 className='font-bold mb-2'>{getTerminalTitle()}</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4'>
                {/* <FormField
                    control={control}
                    name='terminal1Id'
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
                                        setValue('terminal1Id', selectedTerminal.id) 
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
                    name='terminal1Id' // Работаем с ID терминала
                    rules={{ required: 'Пожалуйста, выберите терминал' }}
                    render={({ field }) => (
                        <FormItem>
                            {' '}
                            <Select
                                disabled={isReadOnly}
                                onValueChange={value => {
                                    const selectedTerminal = terminals.find(t => t.id === Number(value))
                                    if (selectedTerminal) {
                                        field.onChange(selectedTerminal.id) // Сохраняем ID
                                        setValue('terminal1Name', selectedTerminal.name)
                                        setValue('terminal1Address', selectedTerminal.description || '')
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
                                <SelectContent
                                    onPointerDownOutside={e => e.preventDefault()}
                                    onCloseAutoFocus={e => e.preventDefault()}
                                >
                                    <div className='p-2'>
                                        <Input
                                            placeholder='Поиск терминала...'
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            // onFocus={() => setIsOpen(true)}
                                            onFocus={() => {
                                                setTimeout(() => setIsOpen(true), 100)
                                            }}
                                            onKeyDown={e => e.stopPropagation()}
                                            className='w-full px-3 py-2 border rounded-md'
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
                    name='terminal1Address'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input disabled={isReadOnly} placeholder='Адрес' {...field} className='' />
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
