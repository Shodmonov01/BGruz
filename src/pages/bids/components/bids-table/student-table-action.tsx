import PopupModal from '@/components/shared/popup-modal'
// import TableSearchInput from '@/components/shared/table-search-input'
import StudentCreateForm from '../bid-create-form'

export default function StudentTableActions() {
    return (
        <div className='flex items-center justify-between gap-2 py-5'>
            {/* <div className='flex flex-1 gap-4'>
                <TableSearchInput placeholder='Поиск' />
            </div> */}
            <div className='flex gap-3'>
                <PopupModal renderModal={onClose => <StudentCreateForm modalClose={onClose} />} />
            </div>
        </div>
    )
}
