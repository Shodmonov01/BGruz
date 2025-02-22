import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'

type TPopupModalProps = {
    onConfirm?: () => void
    loading?: boolean
    renderModal: (onClose: () => void) => React.ReactNode
}
export default function PopupModal({ renderModal }: TPopupModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    return (
        <>
            <Button className='text-xs md:text-sm' onClick={() => setIsOpen(true)}>
                <Plus className='mr-2 h-4 w-4' /> Новая заявка
            </Button>
            {/* <Modal isOpen={isOpen} onClose={onClose} className={'!bg-background !px-1 w-[370px] md:w-[800px]'}> */}
            <Modal isOpen={isOpen} onClose={onClose} className={'!bg-background !p-0 w-full h-full md:h-[90vh] md:w-[800px]'}>
                <ScrollArea className='h-[90dvh] md:h-[80dvh] md:px-6 px-0  '>{renderModal(onClose)}</ScrollArea>
            </Modal>
        </>
    )
}
