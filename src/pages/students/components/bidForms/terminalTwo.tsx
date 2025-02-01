import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext, useWatch } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'

function TerminalTwo({ terminals }) {
    const { control, setValue } = useFormContext()

    const loadingType = useWatch({ control, name: 'loadingType' })
    const transportType = useWatch({ control, name: 'transportType' })

    const getTerminalTitle = () => {
        if (transportType === 'Контейнер') return 'Сдать контейнер'
        if (transportType === 'Вагон' && loadingType === 'Погрузка') return 'Терминал погрузки'
        return 'Терминал 2'
    }

    return (
        <div>
            {/* <h1 className='font-bold mb-2'>Терминал 2</h1> */}
            <h1 className='font-bold mb-2'>{getTerminalTitle()}</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4'>
                <FormField
                    control={control}
                    name='terminal2Name'
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Терминал 2</FormLabel> */}
                            <Select
                                onValueChange={value => {
                                    field.onChange(value)
                                    const selectedTerminal = terminals.find(terminal => terminal.name === value)
                                    if (selectedTerminal) {
                                        setValue('terminal2Address', selectedTerminal.description || '')
                                    }
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Выберите терминал 2' />
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
                    name='terminal2Address'
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Адрес</FormLabel> */}
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
            <Separator className='mt-8' />
        </div>
    )
}

export default TerminalTwo
