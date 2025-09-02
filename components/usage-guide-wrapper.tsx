"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { UsageGuideModal } from '@/components/usage-guide-modal';
import { UsageGuideProvider, useUsageGuideContext } from '@/components/usage-guide-context';

function UsageGuideContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { showUsageGuide, openUsageGuide, closeUsageGuide } = useUsageGuideContext();
  const [hasShownForThisSession, setHasShownForThisSession] = useState(false);

  // Show usage guide every time a user authenticates in a new session
  useEffect(() => {
    if (status === 'authenticated' && !hasShownForThisSession) {
      // User is logged in and we haven't shown the guide in this session yet
      console.log('✅ [USAGE_GUIDE] User authenticated. Opening usage guide for this session.');
      openUsageGuide();
      setHasShownForThisSession(true);
    } else if (status === 'unauthenticated') {
      // User is logged out, so reset the flag for the next time they log in
      if (hasShownForThisSession) {
        console.log('🔄 [USAGE_GUIDE] User logged out. Resetting guide flag for next session.');
        setHasShownForThisSession(false);
      }
    }
  }, [status, hasShownForThisSession, openUsageGuide]);

  return (
    <>
      {children}
      <UsageGuideModal 
        isOpen={showUsageGuide} 
        onClose={closeUsageGuide} 
      />
    </>
  );
}

interface UsageGuideWrapperProps {
  children: React.ReactNode;
}

export function UsageGuideWrapper({ children }: UsageGuideWrapperProps) {
  return (
    <UsageGuideProvider>
      <UsageGuideContent>
        {children}
      </UsageGuideContent>
    </UsageGuideProvider>
  );
}
