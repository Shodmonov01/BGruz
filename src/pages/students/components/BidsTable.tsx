import { useState } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface Bid {
    persistentId: string
    cargoTitle: string
    client: { organizationName: string }
    price: number | null
    status: string | null
    startDate: string
    direction: { fromCityId: number; toCityId: number; price: number | null }
    vehicleProfile: { name: string }
    terminal1: { cityName: string; address: string }
    terminal2: { cityName: string; address: string }
    filingTime: string
    vehicleCount: number
    createdBy: string
    createdAt: string
    description: string
}

interface Props {
    bids: Bid[]
}

const columnWidths: { [key: string]: string } = {
    cargoTitle: '200px',
    clientName: '180px',
    fromCity: '150px',
    toCity: '150px',
    vehicle: '180px',
    vehicleCount: '120px',
    price: '150px',
    status: '150px',
    filingTime: '160px',
    description: '250px',
    created: '200px'
}

export default function BidsTable({ bids }: Props) {
    const [search, setSearch] = useState({
        cargoTitle: '',
        clientName: '',
        status: ''
    })

    const filteredBids = bids.filter(bid =>
        Object.entries(search).every(([key, value]) =>
            String(key === 'clientName' ? bid.client.organizationName : (bid as any)[key])
                .toLowerCase()
                .includes(value.toLowerCase())
        )
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {Object.keys(columnWidths).map(key => (
                        <TableHead key={key} style={{ width: columnWidths[key] }}>
                            <Input
                                placeholder={`Поиск по ${key}`}
                                value={(search as any)[key] || ''}
                                onChange={e => setSearch({ ...search, [key]: e.target.value })}
                            />
                        </TableHead>
                    ))}
                </TableRow>
                <TableRow>
                    <TableHead style={{ width: columnWidths.cargoTitle }}>Груз</TableHead>
                    <TableHead style={{ width: columnWidths.clientName }}>Клиент</TableHead>
                    <TableHead style={{ width: columnWidths.fromCity }}>Откуда</TableHead>
                    <TableHead style={{ width: columnWidths.toCity }}>Куда</TableHead>
                    <TableHead style={{ width: columnWidths.vehicle }}>Транспорт</TableHead>
                    <TableHead style={{ width: columnWidths.vehicleCount }}>Кол-во ТС</TableHead>
                    <TableHead style={{ width: columnWidths.price }}>Цена</TableHead>
                    <TableHead style={{ width: columnWidths.status }}>Статус</TableHead>
                    <TableHead style={{ width: columnWidths.filingTime }}>Дата подачи</TableHead>
                    <TableHead style={{ width: columnWidths.description }}>Описание</TableHead>
                    <TableHead style={{ width: columnWidths.created }}>Создано</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredBids.map(bid => (
                    <TableRow key={bid.persistentId}>
                        <TableCell>{bid.cargoTitle || '—'}</TableCell>
                        <TableCell>{bid.client.organizationName || '—'}</TableCell>
                        <TableCell>{bid.terminal1.cityName || '—'}</TableCell>
                        <TableCell>{bid.terminal2.cityName || '—'}</TableCell>
                        <TableCell>{bid.vehicleProfile.name || '—'}</TableCell>
                        <TableCell>{bid.vehicleCount || 0}</TableCell>
                        <TableCell>{bid.price ? `${bid.price.toLocaleString()} ₽` : '0 ₽'}</TableCell>
                        <TableCell>{bid.status || '—'}</TableCell>
                        <TableCell>{bid.filingTime || '—'}</TableCell>
                        <TableCell>{bid.description || '—'}</TableCell>
                        <TableCell>
                            {bid.createdBy} / {new Date(bid.createdAt).toLocaleString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
