"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';

interface UsageGuideContextType {
  showUsageGuide: boolean;
  openUsageGuide: () => void;
  closeUsageGuide: () => void;
}

const UsageGuideContext = createContext<UsageGuideContextType | undefined>(undefined);

export function UsageGuideProvider({ children }: { children: ReactNode }) {
  const [showUsageGuide, setShowUsageGuide] = useState(false);

  const openUsageGuide = () => {
    console.log('🔴 [USAGE_GUIDE] Manual trigger - opening usage guide modal');
    setShowUsageGuide(true);
  };

  const closeUsageGuide = () => {
    setShowUsageGuide(false);
  };

  console.log('🔄 [USAGE_GUIDE_CONTEXT] Provider rerendered. showUsageGuide state:', showUsageGuide);

  return (
    <UsageGuideContext.Provider value={{
      showUsageGuide,
      openUsageGuide,
      closeUsageGuide
    }}>
      {children}
    </UsageGuideContext.Provider>
  );
}

export function useUsageGuideContext() {
  const context = useContext(UsageGuideContext);
  if (context === undefined) {
    throw new Error('useUsageGuideContext must be used within a UsageGuideProvider');
  }
  return context;
}
