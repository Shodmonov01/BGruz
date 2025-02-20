import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

function BidRoute({ formData, handleChange, isReadOnly, terminals, warehouses }) {
    return (
        <>
            <div className='bg-[#00b6f1] text-white py-3 -mx-6 text-center text-xl text-[20px] font-bold'>Маршрут</div>

            <div className='space-y-4'>
                <div>
                    <Label className='text-[18px] font-bold text-[#1E293B]'>Терминал 1</Label>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Select
                                disabled={isReadOnly}
                                onValueChange={value => handleChange('terminal1', value)}
                                value={formData.terminal1?.cityId ? formData.terminal1.cityId.toString() : ''}
                            >
                                <SelectTrigger className='mt-1'>
                                    <SelectValue>{formData.terminal1?.cityName || 'Выберите терминал 1'}</SelectValue>
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
                            <Input disabled={isReadOnly} className='mt-1' value={formData.terminal1?.address || ''} />
                        </div>
                    </div>
                </div>

                <div>
                    <Label className='text-[18px] font-bold text-[#1E293B]'>Склад клиента</Label>
                    <div className='grid grid-cols-2 gap-4 mt-1'>
                        <Select
                            disabled={isReadOnly}
                            onValueChange={value => handleChange('warehouse', value)}
                            defaultValue={formData.warehouses?.cityId?.toString()}
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
                        <Input value={formData.warehouses?.address} placeholder='Адрес' disabled={isReadOnly} />
                    </div>
                    <Button size='sm' className='mt-2 bg-[#00b6f1] font-semibold'>
                        <Plus className='h-4 w-4 mr-1' />
                        Добавить склад
                    </Button>
                </div>

                <div>
                    <Label className='text-[18px] font-bold text-[#1E293B]'>Терминал 2</Label>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Select
                                value={formData.terminal2?.cityId ? formData.terminal2.cityId.toString() : ''}
                                disabled={isReadOnly}
                                onValueChange={value => handleChange('terminal2', value)}
                            >
                                <SelectTrigger className='mt-1'>
                                    <SelectValue>{formData.terminal2?.cityName || 'Выберите терминал 2'}</SelectValue>
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
                            <Input className='mt-1' value={formData.terminal2?.address || ''} disabled={isReadOnly} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BidRoute
