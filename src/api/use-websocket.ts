// import { useCallback, useEffect, useRef } from "react";
// import { useBidContext, Bid } from "@/context/bid-context";
// import { fetchPrivateData } from "@/api/api";
// import { useFilter } from '@/context/filter-context';

// const ws = { current: null as WebSocket | null };
// const reconnectTimeout = { current: null as NodeJS.Timeout | null };
// const heartbeat = { current: null as NodeJS.Timeout | null };
// const pongTimeout = { current: null as NodeJS.Timeout | null };

// const processedUpdates = new Set<string>();
// // Clear old processed messages periodically (every 5 minutes
// setInterval(() => {
//     processedUpdates.clear();
// }, 5 * 60 * 1000);

// export function useWebSocket(refreshBids: (forceIgnoreLocks?: boolean) => void = () => {}, refreshOrders: () => void = () => {}) {
//     const { newBidAdded, isLocked, setCreatedBid } = useBidContext();
//     const { filters } = useFilter();
    
//     const lastFilterChangeRef = useRef<number>(0);
//     const lastUpdateTimeRef = useRef<number>(0);
//     const prevFiltersRef = useRef(filters);
    
//     useEffect(() => {
//         const now = Date.now();
//         // Only update if it's a real filter change, not initial mount
//         if (prevFiltersRef.current !== filters && Object.keys(prevFiltersRef.current).length > 0) {
//             console.log("WebSocket: Detected filter change, tracking timestamp");
//             lastFilterChangeRef.current = now;
//         }
//         prevFiltersRef.current = filters;
//     }, [filters]);
    
//     const isStatusAllowed = useCallback((status: string) => {
//         if (!filters.status || 
//             !Array.isArray(filters.status) || 
//             filters.status.length === 0 || 
//             filters.status.includes('all')) {
//             return true;
//         }
        
//         return filters.status.includes(status);
//     }, [filters]);
    
//     const fetchSingleBid = useCallback(async (bidId: string, status?: string, timestamp?: string) => {
//         const now = Date.now();
        
//         const updateId = `${bidId}_${timestamp || now}`;
//         if (processedUpdates.has(updateId)) {
//             console.log(`WebSocket: Skipping already processed update for bid ${bidId}`);
//             return;
//         }
        
//         if (now - lastUpdateTimeRef.current < 300) {
//             console.log(`WebSocket: Throttling update for bid ${bidId}, too soon after last update`);
//             return;
//         }
        
//         const recentFilterChange = now - lastFilterChangeRef.current < 5000;
//         if (recentFilterChange) {
//             console.log(`WebSocket: Skipping update for bid ${bidId} due to recent filter change`);
//             return;
//         }
        
//         lastUpdateTimeRef.current = now;
//         processedUpdates.add(updateId);
                
//         if (status === 'canceled' && !isStatusAllowed('canceled')) {
//             console.log("WebSocket: Skipping fetch for canceled bid as it's filtered out");
//             const minimalBid: Bid = {
//                 id: bidId,
//                 _id: bidId,
//                 status: 'canceled',
//                 client: { organizationName: '' },
//                 cargoTitle: '',
//                 price: null
//             };
//             setCreatedBid(minimalBid);
//             return;
//         }
        
//         try {
//             const token = localStorage.getItem('authToken') || '';
//             const bidDetails = await fetchPrivateData<Bid>(`api/v1/bids/${bidId}`, token);
//             console.log("WebSocket: Got bid details:", bidDetails);
            
//             if (!bidDetails) {
//                 console.log("WebSocket: No bid details received");
//                 return;
//             }
            
//             const transformedBid: Bid = { 
//                 ...bidDetails,
//                 client: bidDetails.client || { 
//                     organizationName: bidDetails.clientName || `Client ${bidDetails.clientId}` || 'Unknown Client'
//                 },
//                 cargoTitle: bidDetails.cargoTitle || bidDetails.cargoType || 'Unspecified',
//                 price: bidDetails.price === undefined ? null : bidDetails.price,
//                 status: bidDetails.status || 'waiting'
//             };
            
//             if (transformedBid.id && !transformedBid._id) {
//                 transformedBid._id = transformedBid.id;
//             } else if (transformedBid._id && !transformedBid.id) {
//                 transformedBid.id = transformedBid._id;
//             } else if (!transformedBid.id && !transformedBid._id) {
//                 transformedBid.id = bidId;
//                 transformedBid._id = bidId;
//             }
            
//             setCreatedBid(transformedBid);
            
//         } catch (error) {
//             console.error("WebSocket: Error fetching bid:", error);
//         }
//     }, [setCreatedBid, isStatusAllowed]);
    
//     const connect = () => {
//         if (ws.current) return;

//         const token = localStorage.getItem("authToken");
//         const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

//         ws.current = new WebSocket(`${WS_BASE_URL}?token=${token}`);

//         ws.current.onopen = () => {
//             // console.log("✅ WebSocket открыт");
//             startHeartbeat();
//         };

//         ws.current.onmessage = (event) => {
//             try {
//                 const data = JSON.parse(event.data);
//                 const now = Date.now();
                
//                 // Check if we've had recent filter changes (within last 5 seconds)
//                 const recentFilterChange = now - lastFilterChangeRef.current < 5000;
                
//                 console.log("WebSocket message received:", data, 
//                            "isLocked:", isLocked, 
//                            "newBidAdded:", newBidAdded, 
//                            "recentFilterChange:", recentFilterChange);
                
//                 if (data.type === "bid_update" && data.payload && data.payload.id) {
//                     const bidId = data.payload.id;
//                     const status = data.payload.status;
//                     const timestamp = data.timestamp;
                    
//                     console.log(`WebSocket: Received bid update for id ${bidId} with status ${status}`);
                    
//                     // Skip WebSocket update if:
//                     // 1. Operations are locked, or
//                     // 2. A new bid was just added, or
//                     // 3. Filters were recently changed
//                     if (isLocked || newBidAdded || recentFilterChange) {
//                         console.log(`WebSocket: Skipping bid refresh for id ${bidId} - locked:${isLocked}, newBid:${newBidAdded}, recentFilter:${recentFilterChange}`);
//                         return;
//                     }
                    
//                     console.log(`WebSocket: Fetching updated bid with id ${bidId}`);
//                     // Pass the status and timestamp from the WebSocket message for better tracking
//                     fetchSingleBid(bidId, status, timestamp);
//                 }
                
//                 if (data.type === "order_update") {
//                     console.log("WebSocket: Triggering order refresh");
//                     refreshOrders();
//                 }
                
//                 if (data.type === "ping" && pongTimeout.current) {
//                     clearTimeout(pongTimeout.current);
//                 }
//             } catch (error) {
//                 console.error("Error processing WebSocket message:", error);
//             }
//         };
        
//         ws.current.onerror = (error) => {
//             // console.error("⚠️ WebSocket ошибка:", error);
//         };

//         ws.current.onclose = () => {
//             // console.warn("🔴 WebSocket закрыт, перезапускаем...");
//             ws.current = null;
//             reconnectTimeout.current = setTimeout(connect, 5000);
//         };
//     };

//     const startHeartbeat = () => {
//         stopHeartbeat();
//         heartbeat.current = setInterval(() => {
//             if (ws.current?.readyState === WebSocket.OPEN) {
//                 ws.current.send(JSON.stringify({ type: "pong" }));
//                 if (pongTimeout.current) clearTimeout(pongTimeout.current);
//                 pongTimeout.current = setTimeout(() => {
//                     console.warn("⚠️ Нет пинга, перезапускаем WebSocket...");
//                     ws.current?.close();
//                 }, 30500);
//             }
//         }, 28000);
//     };

//     const stopHeartbeat = () => {
//         if (heartbeat.current) clearInterval(heartbeat.current);
//         if (pongTimeout.current) clearTimeout(pongTimeout.current);
//     };

//     useEffect(() => {
//         // console.log("🟢 useWebSocket запущен");
//         connect();

//         return () => {
//             // console.log("🔴 useWebSocket размонтирован, но WebSocket остаётся активным");
//         };
//     }, []);
// }


import { useCallback, useEffect, useRef } from "react";
import { useBidContext, Bid } from "@/context/bid-context";
import { fetchPrivateData } from "@/api/api";
import { useFilter } from '@/context/filter-context';
import { Order, useOrderContext } from "@/context/order-context";

const ws = { current: null as WebSocket | null };
const reconnectTimeout = { current: null as NodeJS.Timeout | null };
const heartbeat = { current: null as NodeJS.Timeout | null };
const pongTimeout = { current: null as NodeJS.Timeout | null };

const processedUpdates = new Set<string>();
// Clear old processed messages periodically (every 5 minutes
setInterval(() => {
    processedUpdates.clear();
}, 5 * 60 * 1000);

export function useWebSocket(refreshBids: (forceIgnoreLocks?: boolean) => void = () => {}, refreshOrders: () => void = () => {}) {
    const { newBidAdded, isLocked, setCreatedBid } = useBidContext();
    const { filters } = useFilter();
    const { setCreatedOrder } = useOrderContext();
    
    const lastFilterChangeRef = useRef<number>(0);
    // const lastUpdateTimeRef = useRef<number>(0);
    const lastBidUpdateTimeRef = useRef<number>(0);
    const lastOrderUpdateTimeRef = useRef<number>(0);

    const prevFiltersRef = useRef(filters);
    
    useEffect(() => {
        const now = Date.now();
        if (prevFiltersRef.current !== filters && Object.keys(prevFiltersRef.current).length > 0) {
            console.log("WebSocket: Detected filter change, tracking timestamp");
            lastFilterChangeRef.current = now;
        }
        prevFiltersRef.current = filters;
    }, [filters]);
    
    const isStatusAllowed = useCallback((status: string) => {
        if (!filters.status || 
            !Array.isArray(filters.status) || 
            filters.status.length === 0 || 
            filters.status.includes('all')) {
            return true;
        }
        
        return filters.status.includes(status);
    }, [filters]);
    
    const fetchSingleBid = useCallback(async (bidId: string, status?: string, timestamp?: string) => {
        const now = Date.now();
        
        const updateId = `${bidId}_${timestamp || now}`;
        if (processedUpdates.has(updateId)) {
            console.log(`WebSocket: Skipping already processed update for bid ${bidId}`);
            return;
        }
        
        if (now - lastBidUpdateTimeRef.current < 300) {
            console.log(`WebSocket: Throttling update for bid ${bidId}, too soon after last update`);
            return;
        }
        
        const recentFilterChange = now - lastFilterChangeRef.current < 5000;
        if (recentFilterChange) {
            console.log(`WebSocket: Skipping update for bid ${bidId} due to recent filter change`);
            return;
        }
        
        lastBidUpdateTimeRef.current = now;
        processedUpdates.add(updateId);
                
        if (status === 'canceled' && !isStatusAllowed('canceled')) {
            console.log("WebSocket: Skipping fetch for canceled bid as it's filtered out");
            const minimalBid: Bid = {
                id: bidId,
                _id: bidId,
                status: 'canceled',
                client: { organizationName: '' },
                cargoTitle: '',
                price: null
            };
            setCreatedBid(minimalBid);
            return;
        }
        
        try {
            const token = localStorage.getItem('authToken') || '';
            const bidDetails = await fetchPrivateData<Bid>(`api/v1/bids/${bidId}`, token);
            console.log("WebSocket: Got bid details:", bidDetails);
            
            if (!bidDetails) {
                console.log("WebSocket: No bid details received");
                return;
            }
            
            const transformedBid: Bid = { 
                ...bidDetails,
                client: bidDetails.client || { 
                    organizationName: bidDetails.clientName || `Client ${bidDetails.clientId}` || 'Unknown Client'
                },
                cargoTitle: bidDetails.cargoTitle || bidDetails.cargoType || 'Unspecified',
                price: bidDetails.price === undefined ? null : bidDetails.price,
                status: bidDetails.status || 'waiting'
            };
            
            if (transformedBid.id && !transformedBid._id) {
                transformedBid._id = transformedBid.id;
            } else if (transformedBid._id && !transformedBid.id) {
                transformedBid.id = transformedBid._id;
            } else if (!transformedBid.id && !transformedBid._id) {
                transformedBid.id = bidId;
                transformedBid._id = bidId;
            }
            
            setCreatedBid(transformedBid);
            
        } catch (error) {
            console.error("WebSocket: Error fetching bid:", error);
        }
    }, [setCreatedBid, isStatusAllowed]);

    
    const fetchSingleOrder = useCallback(async (orderId: string, status?: string, timestamp?: string) => {
        const now = Date.now();
        
        const updateId = `order_${orderId}_${timestamp || now}`;
        if (processedUpdates.has(updateId)) {
            console.log(`WebSocket: Skipping already processed order update for id ${orderId}`);
            return;
        }
        
        // Throttle updates to prevent too many requests
        if (now - lastOrderUpdateTimeRef.current < 300) {
            console.log(`WebSocket: Throttling order update for id ${orderId}, too soon after last update`);
            return;
        }
        
        lastOrderUpdateTimeRef.current = now;
        processedUpdates.add(updateId);
        
        console.log("WebSocket: Fetching single order:", orderId, "status from message:", status);
        
        try {
            const token = localStorage.getItem('authToken') || '';
            const orderDetails:Order = await fetchPrivateData(`api/v1/orders/${orderId}`, token);
            console.log("WebSocket: Got order details:", orderDetails);
            
            if (!orderDetails) {
                console.log("WebSocket: No order details received");
                return;
            }
            
            // Transform order data if needed for consistency
            const transformedOrder = { 
                ...orderDetails,
                id: orderDetails.id || orderId,
                status: orderDetails.status || 'new',
                price: orderDetails.price || 0,
                createdAt: orderDetails.createdAt || new Date().toISOString(),
                buyBid: orderDetails.buyBid || {},
                customer: orderDetails.customer || {},
                carrier: orderDetails.carrier || {},
                persistentId: orderDetails.buyBid?.persistentId || '',
                cargoTitle: orderDetails.buyBid?.cargoTitle || '',
                clientId: orderDetails.customer?.organizationId || 0,
                startDate: orderDetails.buyBid?.loadingDate || new Date().toISOString(),
                client: { 
                    organizationName: orderDetails.customer?.organizationName || '' 
                },
                terminal1: orderDetails.buyBid?.terminal1 || { cityName: '', address: '' },
                terminal2: orderDetails.buyBid?.terminal2 || { cityName: '', address: '' }
            };
            
            console.log("WebSocket: Transformed order:", transformedOrder);
            
            setCreatedOrder(transformedOrder);
            
        } catch (error) {
            console.error("WebSocket: Error fetching order:", error);
        }
    }, [setCreatedOrder]);
    
    const connect = () => {
        if (ws.current) return;

        const token = localStorage.getItem("authToken");
        const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

        ws.current = new WebSocket(`${WS_BASE_URL}?token=${token}`);

        ws.current.onopen = () => {
            // console.log("✅ WebSocket открыт");
            startHeartbeat();
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const now = Date.now();
                
                // Check if we've had recent filter changes (within last 5 seconds)
                const recentFilterChange = now - lastFilterChangeRef.current < 5000;
                
                console.log("WebSocket message received:", data, 
                           "isLocked:", isLocked, 
                           "newBidAdded:", newBidAdded, 
                           "recentFilterChange:", recentFilterChange);
                
                if (data.type === "bid_update" && data.payload && data.payload.id) {
                    const bidId = data.payload.id;
                    const status = data.payload.status;
                    const timestamp = data.timestamp;
                    
                    console.log(`WebSocket: Received bid update for id ${bidId} with status ${status}`);
                    
                    if (isLocked || newBidAdded || recentFilterChange) {
                        console.log(`WebSocket: Skipping bid refresh for id ${bidId} - locked:${isLocked}, newBid:${newBidAdded}, recentFilter:${recentFilterChange}`);
                        return;
                    }
                    
                    console.log(`WebSocket: Fetching updated bid with id ${bidId}`);
                    fetchSingleBid(bidId, status, timestamp);
                }
                
                if (data.type === "order_update" && data.payload && data.payload.id) {
                    const orderId = data.payload.id;
                    const status = data.payload.status;
                    const timestamp = data.timestamp;
                    
                    console.log(`WebSocket: Received order update for id ${orderId} with status ${status}`);
                    
                    fetchSingleOrder(orderId, status, timestamp);
                }
                
                if (data.type === "ping" && pongTimeout.current) {
                    clearTimeout(pongTimeout.current);
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };
        
        ws.current.onerror = (error) => {
            // console.error("⚠️ WebSocket ошибка:", error);
        };

        ws.current.onclose = () => {
            // console.warn("🔴 WebSocket закрыт, перезапускаем...");
            ws.current = null;
            reconnectTimeout.current = setTimeout(connect, 5000);
        };
    };

    const startHeartbeat = () => {
        stopHeartbeat();
        heartbeat.current = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: "pong" }));
                if (pongTimeout.current) clearTimeout(pongTimeout.current);
                pongTimeout.current = setTimeout(() => {
                    console.warn("⚠️ Нет пинга, перезапускаем WebSocket...");
                    ws.current?.close();
                }, 30500);
            }
        }, 28000);
    };

    const stopHeartbeat = () => {
        if (heartbeat.current) clearInterval(heartbeat.current);
        if (pongTimeout.current) clearTimeout(pongTimeout.current);
    };

    useEffect(() => {
        // console.log("🟢 useWebSocket запущен");
        connect();

        return () => {
            // console.log("🔴 useWebSocket размонтирован, но WebSocket остаётся активным");
        };
    }, []);
}
