import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext, useWatch } from 'react-hook-form'

function TerminalOne({ terminals }) {
    const { control, setValue } = useFormContext()
    const loadingType = useWatch({ control, name: 'loadingType' })
    const transportType = useWatch({ control, name: 'transportType' })

    const getTerminalTitle = () => {
        if (transportType === 'Контейнер') return 'Получить контейнер'
        if (transportType === 'Вагон' && loadingType === 'Выгрузка') return 'Терминал выгрузки'
        return 'Терминал 1'
    }

    return (
        <div>
            {/* <h1 className='font-bold mb-2'>Терминал 1</h1> */}
            <h1 className='font-bold mb-2'>{getTerminalTitle()}</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4'>
                <FormField
                    control={control}
                    name='terminal1Name'
                    rules={{ required: 'Пожалуйста, выберите терминал' }}
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={value => {
                                    field.onChange(value)
                                    const selectedTerminal = terminals.find(terminal => terminal.id === Number(value))
                                    if (selectedTerminal) {
                                        setValue('terminal1Address', selectedTerminal.description || '')
                                        setValue('terminal1Id', selectedTerminal.id) // сохраняем ID терминала
                                    }
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Выберите терминал 1' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {terminals.map(terminal => (
                                        <SelectItem key={terminal.id} value={terminal.id.toString()}>
                                            {terminal.name}
                                        </SelectItem>
                                    ))}
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
                                    className='px-4 py-3 shadow-inner drop-shadow-xl'
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
