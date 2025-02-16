import PopupModal from '@/components/shared/popup-modal'
import StudentCreateForm from './bid-create-form'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

function BidHeader({ setIsShortTable, isShortTable }) {
    return (
        <div className='flex '>
            <div className='w-full flex flex-wrap gap-5 items-center justify-between'>
                <div className='flex gap-2 items-center'>
                    <span className='text-[#03B4E0] text-[38px]'>
                        Заявки <span className='text-primary'>|</span>
                    </span>
                    <div className='flex gap-3 '>
                        <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
                    </div>
                    <Button variant='outline'>Загрузить</Button>
                    <Button variant='outline'>Отменить</Button>
                </div>
                <div className='flex items-center gap-3'>
                    <Button variant='secondary' onClick={() => setIsShortTable(prev => !prev)}>
                        {isShortTable ? 'Полная версия' : 'Краткая версия'}
                    </Button>
                    <div className='relative flex items-center w-full max-w-md'>
                        <Search className='absolute left-3 text-muted-foreground w-5 h-5' />
                        <Input
                            type='text'
                            placeholder='Поиск заявки'
                            className='pl-10 h-10 border border-border rounded-lg focus:ring-2 focus:ring-primary'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidHeader
