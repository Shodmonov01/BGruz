import { useCallback, useEffect, useRef } from "react";

const processedUpdates = new Set<string>();
setInterval(() => {
    processedUpdates.clear();
}, 5 * 60 * 1000);

export function useWebSocket(onMessage: (data: any) => void) {
    const socketRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token not found');
            return;
        }

        const ws = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}?token=${token}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data); 
        };

        socketRef.current = ws;
    }, [onMessage]);

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connect]);
}
