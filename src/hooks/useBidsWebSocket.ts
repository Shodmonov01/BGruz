// import { useEffect, useRef, useState } from "react";
// import { useGetBids } from "./useGetBids";

// export const useBidsWebSocket = () => {
//     const ws = useRef<WebSocket | null>(null);
//     const [reconnectKey, setReconnectKey] = useState(0); // Используем key для пересоздания WS
//     const { refreshBids } = useGetBids(5);

//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;

//         const socketUrl = `wss://portal.bgruz.com/ws?token=${token}`;
//         ws.current = new WebSocket(socketUrl);

//         ws.current.onopen = () => {
//             console.log("WebSocket подключен");
//         };

//         ws.current.onmessage = (event) => {
//             try {
//                 const data = JSON.parse(event.data);
//                 if (data.type === "bid_update") {
//                     console.log("Обновление заявки:", data.payload);
//                     refreshBids();
//                 }
//             } catch (error) {
//                 console.error("Ошибка обработки WebSocket-сообщения:", error);
//             }
//         };

//         ws.current.onerror = (error) => {
//             console.error("WebSocket ошибка:", error);
//         };

//         ws.current.onclose = () => {
//             console.warn("WebSocket закрыт, попытка переподключения...");
//             setTimeout(() => setReconnectKey((prev) => prev + 1), 5000); // Перезапуск WS через 5 секунд
//         };

//         return () => {
//             ws.current?.close();
//         };
//     }, [reconnectKey]); // При изменении reconnectKey создаем новый WebSocket
// };



import { useEffect, useRef, useState } from "react";
import { useGetBids } from "./useGetBids";

export const useBidsWebSocket = () => {
    const ws = useRef<WebSocket | null>(null);
    const [reconnectKey, setReconnectKey] = useState(0);
    const { refreshBids } = useGetBids(5);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("❌ Токен не найден в localStorage");
            return;
        }

        const socketUrl = `wss://portal.bgruz.com/ws?token=${token}`;
        console.log("🔗 Подключение к WebSocket:", socketUrl);

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log("✅ WebSocket подключен");
        };

        // ws.current.onmessage = (event) => {
        
        //     try {
        //         const data = JSON.parse(event.data);
        //         console.log("📩 Получено сообщение:", data);

        //         if (data.type === "bid_update") {
        //             console.log("🔄 Обновление заявки:", data.payload);
        //             refreshBids();
        //         }
        //     } catch (error) {
        //         console.error("❌ Ошибка обработки WebSocket-сообщения:", error);
        //     }
        // };



        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📩 Получено сообщение:", data);
        
                switch (data.type) {
                    case "bid_update":
                        console.log("🔄 Обновление заявки:", data.payload);
                        refreshBids(); // Обновляем заявки
                        break;
                    case "order_update":
                        console.log("📦 Обновление заказа:", data.payload);
                        // Если есть аналогичная функция для заказов, вызываем её
                        break;
                    case "status":
                        console.log("✅ WebSocket статус:", data.payload);
                        break;
                    case "error":
                        console.error("❌ Ошибка от сервера:", data.payload);
                        break;
                    default:
                        console.warn("⚠️ Неизвестный тип сообщения:", data);
                }
            } catch (error) {
                console.error("❌ Ошибка обработки WebSocket-сообщения:", error);
            }
        };
        
        ws.current.onerror = (error) => {
            console.error("❌ WebSocket ошибка:", error);
        };

        ws.current.onclose = (event) => {
            console.warn("⚠️ WebSocket закрыт, код:", event.code);
            setTimeout(() => setReconnectKey((prev) => prev + 1), 5000);
        };

        return () => {
            console.log("🛑 Закрытие WebSocket");
            ws.current?.close();
        };
    }, [reconnectKey]);
};





// import { useEffect, useRef } from 'react'

// export function useBidsWebSocket(onBidUpdate?: () => void) {
//     const ws = useRef<WebSocket | null>(null)
//     const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)

//     const connect = () => {
//         if (ws.current) ws.current.close() // Закрываем старый сокет, если он есть

//         const token = localStorage.getItem("authToken");
//         ws.current = new WebSocket(`wss://portal.bgruz.com/ws?token=${token}`)

//         ws.current.onopen = () => {
//             console.log('✅ WebSocket открыт')
//         }

//         ws.current.onmessage = (event) => {
//             try {
//                 const data = JSON.parse(event.data)
//                 console.log('📩 Получено сообщение:', data)

//                 if (data.type === 'bid_update') {
//                     console.log('🔄 Новая заявка:', data.payload)
//                     onBidUpdate?.() // Обновляем таблицу
//                 }
//             } catch (error) {
//                 console.error('❌ Ошибка обработки сообщения:', error)
//             }
//         }

//         ws.current.onclose = () => {
//             console.log('❌ WebSocket закрыт, попытка переподключения через 3 сек...')
//             reconnectTimeout.current = setTimeout(connect, 3000) // Переподключаемся через 3 секунды
//         }

//         ws.current.onerror = (error) => {
//             console.error('⚠️ WebSocket ошибка:', error)
//             ws.current?.close()
//         }
//     }

//     useEffect(() => {
//         connect()

//         return () => {
//             if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
//             ws.current?.close()
//         }
//     }, [onBidUpdate])
// }
