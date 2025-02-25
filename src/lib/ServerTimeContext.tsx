import { fetchPrivateData } from '@/api/api'
import { createContext, useContext, useEffect, useState } from 'react'

const ServerTimeContext = createContext<number | null>(null)

export const useServerTime = () => useContext(ServerTimeContext)

interface ServerTimeResponse {
    currentTime: string;
}

export const ServerTimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [serverTime, setServerTime] = useState<number | null>(null)

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                const res = await fetchPrivateData("api/v1/time/now", token) as ServerTimeResponse;
    
                const parsedTime = new Date(res.currentTime).getTime();
    
                setServerTime(parsedTime);
            } catch (error) {
                console.error("❌ Error fetching time:", error);
            }
        };
    
        fetchTime();
        const interval = setInterval(fetchTime, 10000);
        return () => clearInterval(interval);
    }, []);
    

    return <ServerTimeContext.Provider value={serverTime}>{children}</ServerTimeContext.Provider>
}
