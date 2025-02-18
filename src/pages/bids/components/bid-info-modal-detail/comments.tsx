import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function Comments({ formData, handleChange, isReadOnly }) {
    return (
        <div>
            {' '}
            <div className='space-y-4'>
                <div>
                    <Label className='font-medium'>Груз</Label>
                    <Input
                        className='mt-1'
                        placeholder='Название груза'
                        value={formData.cargoTitle || ''}
                        onChange={e => handleChange('cargoTitle', e.target.value)}
                        readOnly={isReadOnly}
                    />
                </div>
                <div>
                    <Label className='font-medium'>Комментарии</Label>
                    <Textarea
                        placeholder='Комментарии к грузу'
                        className='mt-1 min-h-[100px]'
                        value={formData.description || ''}
                        onChange={e => handleChange('description', e.target.value)}
                        readOnly={isReadOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default Comments
