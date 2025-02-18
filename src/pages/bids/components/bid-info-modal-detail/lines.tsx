import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function Lines({ formData, terminals, isReadOnly, handleChange, warehouses }) {
    return (
        <div>
            {' '}
            <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <Label className='font-medium'>Терминал 1</Label>
                        <Select
                            onValueChange={value => handleChange('terminal1', value)}
                            defaultValue={formData.terminal1?.cityId?.toString()}
                        >
                            <SelectTrigger className='mt-1'>
                                <SelectValue placeholder='Выберите терминал 1' />
                            </SelectTrigger>
                            <SelectContent>
                                {terminals.map(terminal => (
                                    <SelectItem key={terminal.id} value={terminal.id.toString()}>
                                        {terminal.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className='font-medium'>Адрес</Label>
                        <Input className='mt-1' value={formData.terminal1?.address || ''} readOnly={isReadOnly} />
                    </div>
                </div>

                <div>
                    <Label className='font-medium'>Склад клиента</Label>
                    <div className='grid grid-cols-2 gap-4 mt-1'>
                        <Select
                            onValueChange={value => handleChange('warehouse', value)}
                            defaultValue={formData.warehouses?.[0]?.cityId?.toString()}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Выберите склад' />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map(warehouse => (
                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            value={formData.warehouses?.[0]?.address || ''}
                            placeholder='Адрес'
                            readOnly={isReadOnly}
                        />
                    </div>
                    <Button size='sm' className='mt-2 bg-[#00b6f1] font-semibold'>
                        <Plus className='h-4 w-4 mr-1' />
                        Добавить склад
                    </Button>
                </div>

                <div>
                    <Label className='font-medium'>Терминал 2</Label>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Select
                                onValueChange={value => handleChange('terminal2', value)}
                                defaultValue={formData.terminal2?.cityId?.toString()}
                            >
                                <SelectTrigger className='mt-1'>
                                    <SelectValue placeholder='Выберите терминал 2' />
                                </SelectTrigger>
                                <SelectContent>
                                    {terminals.map(terminal => (
                                        <SelectItem key={terminal.id} value={terminal.id.toString()}>
                                            {terminal.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Input className='mt-1' value={formData.terminal2?.address || ''} readOnly={isReadOnly} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lines
