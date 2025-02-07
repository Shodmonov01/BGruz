import { useEffect, useState } from 'react'
import { postData2 } from '@/api/api'

interface BidFilter {
    number?: number
    clientId?: number
    status?: string[]
    clientName?: string
}

interface Bid {
    persistentId: string
    cargoTitle: string
    clientId: number
    price: number
    status: string | null
    startDate: string
    client: { organizationName: string }
    terminal1: { cityName: string; address: string }
    terminal2: { cityName: string; address: string }
}

export const useGetBids = (offset: number, limit: number, filters: BidFilter) => {
    const [bids, setBids] = useState<Bid[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBids = async () => {
            setLoading(true)
            setError(null)

            try {
                const token = localStorage.getItem('authToken') || ''
                // const response = await postData2<{ items: Bid[] }>(
                //     'api/v1/bids/getbatch',
                //     {
                //         startFrom: { value: '', fieldName: '' },
                //         filter: filters,
                //         sort: { fieldName: 'createdAt', order: 'descending' }
                //     },
                //     token
                // )

                const response = await postData2<{ items: Bid[] }>(
                  'api/v1/bids/getbatch',
                  {}, // Пустой body, как в Postman
                  token
              )

                console.log('Ответ от API:', response.items)
                setBids(response.items)
            } catch (err) {
                console.error('Ошибка при загрузке заявок:', err)
                setError('Не удалось загрузить заявки. Попробуйте позже.')
            } finally {
                setLoading(false)
            }
        }

        fetchBids()
    }, [offset, limit, filters])

    return { bids, loading, error }
}


// import { useEffect, useState } from "react";
// import { postData2 } from "@/api/api";

// interface BidFilter {
//   number?: number;
//   clientId?: number;
//   status?: string[];
//   clientName?: string;
// }

// interface Bid {
//   persistentId: string;
//   cargoTitle: string;
//   clientId: number;
//   price: number;
//   status: string | null;
//   startDate: string;
//   client: { organizationName: string };
//   terminal1: { cityName: string; address: string };
//   terminal2: { cityName: string; address: string };
// }

// const SOCKET_URL = "wss://portal.bgruz.com/ws"; // Укажите правильный URL

// export const useGetBids = (offset: number, limit: number, filters: BidFilter) => {
//   const [bids, setBids] = useState<Bid[] | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBids = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("authToken") || "";
//         const response = await postData2<{ items: Bid[] }>(
//           "api/v1/bids/getbatch",
//           {
//             startFrom: { value: "", fieldName: "" },
//             filter: filters,
//             sort: { fieldName: "createdAt", order: "descending" },
//           },
//           token
//         );

//         console.log("Ответ от API:", response.items);
//         setBids(response.items);
//       } catch (err) {
//         console.error("Ошибка при загрузке заявок:", err);
//         setError("Не удалось загрузить заявки. Попробуйте позже.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBids();

//     // Подключение к WebSocket
//     const token = localStorage.getItem("authToken")
//     const socket = new WebSocket(SOCKET_URL, token);

//     socket.onopen = () => {
//       console.log("WebSocket подключен");
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         if (data.type === "bid_update") {
//           console.log("Новая заявка:", data.payload);

//           setBids((prevBids) => {
//             if (!prevBids) return [data.payload];
//             return [data.payload, ...prevBids];
//           });
//         }
//       } catch (error) {
//         console.error("Ошибка обработки сообщения:", error);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket ошибка:", error);
//     };

//     socket.onclose = () => {
//       console.log("WebSocket соединение закрыто");
//     };

//     return () => {
//       socket.close();
//     };
//   }, [offset, limit, filters]);

//   return { bids, loading, error };
// };


// import { useEffect, useState } from "react";
// import { postData2 } from "@/api/api";

// interface BidFilter {
//   number?: number;
//   clientId?: number;
//   status?: string[];
//   clientName?: string;
// }

// interface Bid {
//   persistentId: string;
//   cargoTitle: string;
//   clientId: number;
//   price: number;
//   status: string | null;
//   startDate: string;
//   client: { organizationName: string };
//   terminal1: { cityName: string; address: string };
//   terminal2: { cityName: string; address: string };
// }

// const SOCKET_URL = "wss://portal.bgruz.com/ws"; // Убедитесь, что это правильный URL

// export const useGetBids = (offset: number, limit: number, filters: BidFilter) => {
//   const [bids, setBids] = useState<Bid[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBids = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("authToken") || "";
//         const response = await postData2<{ items: Bid[] }>(
//           "api/v1/bids/getbatch",
//           {
//             startFrom: { value: "", fieldName: "" },
//             filter: filters,
//             sort: { fieldName: "createdAt", order: "descending" },
//           },
//           token
//         );

//         setBids(response.items);
//       } catch (err) {
//         console.error("Ошибка при загрузке заявок:", err);
//         setError("Не удалось загрузить заявки. Попробуйте позже.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBids();

//     // === Подключение к WebSocket ===
//     const token = localStorage.getItem("authToken");
//     const socket = new WebSocket(`${SOCKET_URL}?token=${token}`);

//     socket.onopen = () => {
//       console.log("WebSocket подключен");

//       // Отправка сообщения на сервер, если требуется
//       socket.send(JSON.stringify({ action: "subscribe", channel: "bids" }));
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         if (data.type === "bid_update") {
//           console.log("Новая заявка:", data.payload);

//           setBids((prevBids) => [data.payload, ...prevBids]);
//         }
//       } catch (error) {
//         console.error("Ошибка обработки сообщения:", error);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket ошибка:", error);
//     };

//     socket.onclose = (event) => {
//       console.log(`WebSocket закрыт: код=${event.code}, причина=${event.reason}`);
//     };

//     return () => {
//       socket.close();
//     };
//   }, [offset, limit, filters]);

//   return { bids, loading, error };
// };
