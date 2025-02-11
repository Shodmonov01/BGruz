// import { Button } from '@/components/ui/button'
// import { Modal } from '@/components/ui/modal'
// import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

// function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
//   console.log(selectedBid);

//   return (
//     <div>
//       <Modal className="!bg-background !px-1 w-[370px] md:w-[800px]" isOpen={isModalOpen} onClose={handleCloseModal}>
//         <div className="p-6">
//           <Card className="p-4 shadow-lg border border-gray-300 rounded-lg space-y-4">
//             <CardTitle className="text-xl font-bold">{selectedBid.cargoTitle || '—'}</CardTitle>
//             <CardDescription>
//               <div className="space-y-2">
//                 {/* Client Information */}
//                 <p><strong>Клиент:</strong> {selectedBid.client?.organizationName || '—'}</p>
//                 <p><strong>Дата создания:</strong> {selectedBid.createdAt || '—'}</p>
//                 <p><strong>Создал:</strong> {selectedBid.createdBy || '—'}</p>
//                 <p><strong>Создано в Bgruz:</strong> {selectedBid.createdInBgruzAt || '—'}</p>

//                 {/* Cargo Information */}
//                 <p><strong>Груз:</strong> {selectedBid.cargoTitle || '—'}</p>
//                 <p><strong>Тип груза:</strong> {selectedBid.cargoType || '—'}</p>
//                 <p><strong>Описание:</strong> {selectedBid.description || '—'}</p>

//                 {/* Pricing Information */}
//                 <p><strong>Цена:</strong> {selectedBid.price ? selectedBid.price : '—'}</p>
//                 <p><strong>Цена с НДС:</strong> {selectedBid.priceNds || '—'}</p>
//                 <p><strong>Полная цена:</strong> {selectedBid.fullPrice || '—'}</p>
//                 <p><strong>Полная цена с НДС:</strong> {selectedBid.fullPriceNds || '—'}</p>
//                 <p><strong>Запрос цены:</strong> {selectedBid.isPriceRequest ? 'Да' : 'Нет'}</p>

//                 {/* Date and Time Information */}
//                 <p><strong>Дата начала:</strong> {selectedBid.startDate || '—'}</p>
//                 <p><strong>Дата завершения:</strong> {selectedBid.dueDate || '—'}</p>
//                 <p><strong>Время подачи:</strong> {selectedBid.filingTime || '—'}</p>

//                 {/* Extra Services */}
//                 <div>
//                   <strong>Дополнительные услуги:</strong>
//                   {selectedBid.extraServices?.length > 0 ? (
//                     <ul className="list-disc pl-5">
//                       {selectedBid.extraServices.map((service, index) => (
//                         <li key={index}>{service.name || '—'}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     '—'
//                   )}
//                 </div>

//                 {/* Vehicle and Terminal Information */}
//                 <p><strong>Терминал 1:</strong> {selectedBid.terminal1?.address || '—'}</p>
//                 <p><strong>Терминал 2:</strong> {selectedBid.terminal2?.address || '—'}</p>
//                 <p><strong>Количество транспортных средств:</strong> {selectedBid.vehicleCount || '—'}</p>
//                 <p><strong>Тип транспортного средства:</strong> {selectedBid.vehicleProfile?.name || '—'}</p>

//                 {/* Status Information */}
//                 <p><strong>Статус:</strong> {selectedBid.status || '—'}</p>

//                 {/* Location Information */}
//                 <p><strong>Город отправления:</strong> {selectedBid.terminal1?.cityName || '—'}</p>
//                 <p><strong>Город назначения:</strong> {selectedBid.terminal2?.cityName || '—'}</p>
//                 <p><strong>Адрес склада:</strong> {selectedBid.warehouses?.[0]?.address || '—'}</p>
//               </div>
//             </CardDescription>
//             <CardFooter>
//               <Button onClick={handleCloseModal}>Закрыть</Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default BidsInfoModal


import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { postData2 } from '@/api/api'

function BidsInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
  const [formData, setFormData] = useState({ ...selectedBid })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const token = localStorage.getItem('authToken')
    try {
      await postData2(`api/v1/bids/${formData._id}`, formData, token)
      alert('Заявка успешно обновлена!')
      handleCloseModal()
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error)
    }
  }

  return (
    <div>
      <Modal className="!bg-background !px-1 w-[370px] md:w-[800px]" isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-6">
          <Card className="p-4 shadow-lg border border-gray-300 rounded-lg space-y-4">
            <CardTitle className="text-xl font-bold">
              <Input name="cargoTitle" value={formData.cargoTitle || ''} onChange={handleChange} />
            </CardTitle>
            <CardDescription>
              <div className="space-y-2">
                <p>
                  <strong>Клиент:</strong> <Input name="client.organizationName" value={formData.client?.organizationName || ''} onChange={handleChange} />
                </p>
                <p>
                  <strong>Описание:</strong>
                  <Textarea name="description" value={formData.description || ''} onChange={handleChange} />
                </p>
                <p>
                  <strong>Цена:</strong>
                  <Input type="number" name="price" value={formData.price || ''} onChange={handleChange} />
                </p>
                <p>
                  <strong>Дата начала:</strong>
                  <Input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} />
                </p>
                <p>
                  <strong>Дата завершения:</strong>
                  <Input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleChange} />
                </p>
                <p>
                  <strong>Статус:</strong>
                  <Input name="status" value={formData.status || ''} onChange={handleChange} />
                </p>
              </div>
            </CardDescription>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={handleCloseModal}>Отмена</Button>
              <Button onClick={handleSave}>Сохранить</Button>
            </CardFooter>
          </Card>
        </div>
      </Modal>
    </div>
  )
}

export default BidsInfoModal
