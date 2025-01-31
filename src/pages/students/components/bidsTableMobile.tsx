import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function BidsTableMobile({ bids }) {
    return (
        <div className='flex flex-col gap-4 p-4'>
            {bids.map(bid => (
                <Card key={bid.persistentId} className='p-4 shadow-md rounded-lg'>
                    <CardContent className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <span className='text-lg font-semibold'>
                                {bid.terminal1.cityName} → {bid.terminal2.cityName}
                            </span>
                            <span className='text-sm text-gray-500'>
                                {new Date(bid.filingTime).toLocaleDateString()}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Сумма:</span>
                            <span className='text-green-600 font-semibold'>{bid.price ? `${bid.price} ₽` : '—'}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Статус:</span>
                            <span className='text-blue-500 font-semibold'>{bid.status || '—'}</span>
                        </div>
                        <Button className='mt-2 w-full'>Подробнее</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default BidsTableMobile
