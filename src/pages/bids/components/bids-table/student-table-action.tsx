import PopupModal from '@/components/shared/popup-modal'
import StudentCreateForm from '../bid-create-form'

export default function StudentTableActions() {
    return (
        <div className='flex items-center justify-between gap-2 py-5'>
            <div className='flex gap-3'>
                <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
            </div>
        </div>
    )
}
