import { format } from 'date-fns'

function BidHeader({ formData }) {
    return (
        <div className='text-center'>
            <h2 className='text-[32px] font-bold text-tertiary'>Заявка СМ ID {formData.persistentId}</h2>
            <div className='text-lg text-center flex gap-3 items-center justify-center'>
                <span>Дата {format(new Date(formData.loadingDate || new Date()), 'dd.MM.yyyy')}</span> №
                <span>{formData.number}</span>
            </div>
        </div>
    )
}

export default BidHeader
