import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';

// Export the Bid interface
export interface Bid {
  id?: string;
  _id?: string;
  client?: { organizationName: string };
  clientId?: number;
  clientName?: string;
  cargoTitle?: string;
  cargoType?: string;
  price?: number | null;
  status?: string | null;
  [key: string]: any;  // Allow other properties
}

export interface BidContextType {
  newBidAdded: boolean;
  setNewBidAdded: React.Dispatch<React.SetStateAction<boolean>>;
  newBidId: string | null;
  setNewBidId: React.Dispatch<React.SetStateAction<string | null>>;
  isLocked: boolean;
  lockBatchOperations: () => void;
  unlockBatchOperations: () => void;
  createdBid: Bid | null;
  setCreatedBid: React.Dispatch<React.SetStateAction<Bid | null>>;
}

const BidContext = createContext<BidContextType>({
  newBidAdded: false,
  setNewBidAdded: () => {},
  newBidId: null,
  setNewBidId: () => {},
  isLocked: false,
  lockBatchOperations: () => {},
  unlockBatchOperations: () => {},
  createdBid: null,
  setCreatedBid: () => {}
});

const AUTO_UNLOCK_TIMEOUT = 6000; // 6 seconds

export const BidProvider = ({ children }: { children: ReactNode }) => {
  const [newBidAdded, setNewBidAdded] = useState<boolean>(false);
  const [newBidId, setNewBidId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [createdBid, setCreatedBid] = useState<Bid | null>(null);
  const unlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (newBidAdded) {
      const timeout = setTimeout(() => {
        console.log("Auto-resetting newBidAdded flag");
        setNewBidAdded(false);
        setNewBidId(null);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [newBidAdded]);
  
  useEffect(() => {
    if (createdBid) {
      const timeout = setTimeout(() => {
        console.log("Auto-resetting createdBid to prevent repeated updates");
        setCreatedBid(null);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [createdBid]);
  
  const lockBatchOperations = useCallback(() => {
    console.log("Batch operations locked");
    setIsLocked(true);
    
    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
    }
    
    unlockTimeoutRef.current = setTimeout(() => {
      setIsLocked(false);
    }, AUTO_UNLOCK_TIMEOUT);
  }, []);
  
  const unlockBatchOperations = useCallback(() => {
    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }
    
    setIsLocked(false);
  }, []);

  return (
    <BidContext.Provider
      value={{
        newBidAdded,
        setNewBidAdded,
        newBidId,
        setNewBidId,
        isLocked,
        lockBatchOperations,
        unlockBatchOperations,
        createdBid,
        setCreatedBid
      }}
    >
      {children}
    </BidContext.Provider>
  );
};

export const useBidContext = () => useContext(BidContext); 