import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

function TerminalTwo({ terminals }) {
    const { control, setValue } = useFormContext()

    return (
        <div className='grid grid-cols-2 gap-4'>
            <FormField
                control={control}
                name='terminal1Name'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Терминал 2</FormLabel>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                const selectedTerminal = terminals.find(terminal => terminal.name === value)
                                if (selectedTerminal) {
                                    setValue('terminal1Address', selectedTerminal.description || '')
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
                name='terminal1Address'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Адрес</FormLabel>
                        <FormControl>
                            <Input placeholder='Адрес' {...field} className='px-4 py-3 shadow-inner drop-shadow-xl' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default TerminalTwo
