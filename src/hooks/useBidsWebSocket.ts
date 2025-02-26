import { useEffect, useRef } from 'react'

export function useBidsWebSocket(refreshBids: () => void) {
    const ws = useRef<WebSocket | null>(null)
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
    const heartbeat = useRef<NodeJS.Timeout | null>(null)

    const connect = () => {
        if (ws.current) ws.current.close()

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            // console.warn('🔄 WebSocket уже открыт, не переподключаемся')
            return
        }

        const token = localStorage.getItem('authToken')
        const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL

        ws.current = new WebSocket(`${WS_BASE_URL}?token=${token}`)

        ws.current.onopen = () => {
            // console.log('✅ WebSocket открыт')
            startHeartbeat()
        }

        ws.current.onmessage = event => {
            try {
                const data = JSON.parse(event.data)
                // console.log('📩 Получено сообщение:', data)

                if (data.type === 'bid_update') {
                    // console.log('🔄 Новая заявка:', data.payload)
                    refreshBids() // Принудительное обновление списка
                }
            } catch (error) {
                // console.error('❌ Ошибка обработки сообщения:', error)
            }
        }

        ws.current.onerror = error => {
            // console.error('⚠️ WebSocket ошибка:', error)
        }
    }

    const startHeartbeat = () => {
        stopHeartbeat()
        heartbeat.current = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                // console.log('💓 Ping')
                ws.current.send(JSON.stringify({ type: 'ping' }))
            }
        }, 25000)
    }

    const stopHeartbeat = () => {
        if (heartbeat.current) clearInterval(heartbeat.current)
    }

    useEffect(() => {
        connect()

        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
            stopHeartbeat()
            ws.current?.close()
        }
    }, [])
}

