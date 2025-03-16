import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Order {
    id: number | string;
    status: string;
    price: number;
    createdAt: string;
    buyBid: any;
    customer: any;
    carrier: any;
    persistentId: string;
    cargoTitle: string;
    clientId: number;
    startDate: string;
    client: { organizationName: string };
    terminal1: { cityName: string; address: string };
    terminal2: { cityName: string; address: string };
}

interface OrderContextType {
    createdOrder: Order | null;
    setCreatedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
    
    useEffect(() => {
        if (createdOrder) {
            const timer = setTimeout(() => {
                console.log('Auto-resetting createdOrder to prevent repeated updates');
                setCreatedOrder(null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [createdOrder]);
    
    return (
        <OrderContext.Provider
            value={{
                createdOrder,
                setCreatedOrder
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrderContext must be used within an OrderContextProvider');
    }
    return context;
};

export default OrderContext;
