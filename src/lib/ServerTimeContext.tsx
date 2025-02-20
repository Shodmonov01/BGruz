import { fetchPrivateData } from '@/api/api'
import { createContext, useContext, useEffect, useState } from 'react'

const ServerTimeContext = createContext<number | null>(null)

export const useServerTime = () => useContext(ServerTimeContext)

export const ServerTimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [serverTime, setServerTime] = useState<number | null>(null)

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetchPrivateData("api/v1/time/now", token);
                
                // console.log("✅ API Response:", res);
                // console.log("✅ API current_time:", res.currentTime);
    
                const parsedTime = new Date(res.currentTime).getTime();
                // console.log("🔄 Converted serverTime (ms):", parsedTime);
    
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
