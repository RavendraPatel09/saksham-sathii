import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type OfflineContextType = {
  isOffline: boolean;
  setIsOffline: (state: boolean) => void;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSynced: string | null;
  simulateSync: () => void;
};

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState(() => {
    return localStorage.getItem('saksham-offline-mode') === 'true';
  });
  
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>(isOffline ? 'offline' : 'synced');
  const [lastSynced, setLastSynced] = useState<string | null>(() => {
    return localStorage.getItem('saksham-last-sync') || new Date().toISOString();
  });

  useEffect(() => {
    localStorage.setItem('saksham-offline-mode', isOffline.toString());
    if (isOffline) {
      setSyncStatus('offline');
    } else {
      simulateSync();
    }
  }, [isOffline]);

  const simulateSync = () => {
    if (isOffline) return;
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      const now = new Date().toISOString();
      setLastSynced(now);
      localStorage.setItem('saksham-last-sync', now);
    }, 1500);
  };

  return (
    <OfflineContext.Provider value={{ isOffline, setIsOffline, syncStatus, lastSynced, simulateSync }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
