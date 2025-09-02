"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface UsageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsageGuideModal({ isOpen, onClose }: UsageGuideModalProps) {
  console.log('📖 [USAGE_GUIDE_MODAL] Rendered with isOpen:', isOpen);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop - darker and more prominent */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] w-full mx-4 bg-background rounded-lg shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Usage Guide
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
        
        {/* Image Content */}
        <div className="p-4 flex justify-center items-center bg-white">
          <img
            src="/clarys-usage.png"
            alt="Clarys.ai Usage Guide"
            className="max-w-full max-h-[70vh] object-contain rounded-md shadow-sm"
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            Welcome to Clarys.ai! Follow this guide to get started with all the features
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook to manage usage guide modal state for new users
// This hook is no longer used and is kept here for reference or future use.
// The logic has been moved to UsageGuideWrapper for better session handling.
/*
export function useUsageGuideForNewUsers() {
  const { data: session, status } = useSession();
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const [hasCheckedGuide, setHasCheckedGuide] = useState(false);

  useEffect(() => {
    // Only show for authenticated users
    if (status === 'authenticated' && session?.user && !hasCheckedGuide) {
      // Check if user has seen the guide before (stored in localStorage)
      const hasSeenGuide = localStorage.getItem('clarys-usage-guide-seen');
      
      if (!hasSeenGuide) {
        // Show the guide immediately after login
        console.log('🆕 [USAGE_GUIDE] New user detected, showing usage guide modal');
        setShowUsageGuide(true);
      }
      
      setHasCheckedGuide(true);
    }
  }, [session, status, hasCheckedGuide]);

  const closeUsageGuide = () => {
    setShowUsageGuide(false);
    // Mark as seen so it doesn't show again
    localStorage.setItem('clarys-usage-guide-seen', 'true');
    console.log('✅ [USAGE_GUIDE] Usage guide marked as seen');
  };

  return {
    showUsageGuide,
    closeUsageGuide,
    openUsageGuide: () => setShowUsageGuide(true)
  };
}
*/
