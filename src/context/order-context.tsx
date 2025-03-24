import { IOrder } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OrderContextType {
    createdOrder: IOrder | null;
    setCreatedOrder: React.Dispatch<React.SetStateAction<IOrder | null>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [createdOrder, setCreatedOrder] = useState<IOrder | null>(null);
    
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
